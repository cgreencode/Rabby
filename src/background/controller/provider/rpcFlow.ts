import { ethErrors } from 'eth-rpc-errors';
import {
  keyringService,
  notificationService,
  permissionService,
} from 'background/service';
import { PromiseFlow, underline2Camelcase } from 'background/utils';
import providerController from './controller';

export default (req) =>
  new PromiseFlow()
    .use(async (ctx) => {
      // check method
      const {
        data: { method },
      } = ctx.request;
      ctx.mapMethod = underline2Camelcase(method);

      if (!providerController[ctx.mapMethod]) {
        if (method.startsWith('eth_')) {
          ctx.ethRpc = true;
          // maybe return directly later
          // providerController.ethRpc(req);
          return;
        }

        throw ethErrors.rpc.methodNotFound({
          message: `method [${method}] doesn't has corresponding handler`,
          data: ctx.request.data,
        });
      }
    })
    .use(async () => {
      // check lock
      const isUnlock = keyringService.memStore.getState().isUnlocked;

      if (!isUnlock) {
        await notificationService.requestApproval({});
      }
    })
    .use(async (ctx) => {
      // check connect
      const {
        request: {
          session: { origin, name, icon },
        },
      } = ctx;
      if (!permissionService.hasPerssmion(origin)) {
        const { defaultChain } = await notificationService.requestApproval(
          {
            params: { origin, name, icon },
            aporovalComponent: 'Connect',
          },
          { height: 390 }
        );

        permissionService.addConnectedSite(origin, name, icon, defaultChain);
      }
    })
    .use(async (ctx) => {
      // check need approval
      const {
        request: {
          data: { params },
          session: { origin, name, icon },
        },
        mapMethod,
      } = ctx;
      const [approvalType, condition, { height = 810 } = {}] =
        Reflect.getMetadata('APPROVAL', providerController, mapMethod) || [];

      if (approvalType && (!condition || !condition(ctx.request))) {
        ctx.approvalRes = await notificationService.requestApproval(
          {
            aporovalComponent: approvalType,
            params: {
              data: params,
              session: { origin, name, icon },
            },
            origin,
          },
          { height }
        );

        permissionService.touchConnectedSite(origin);
      }
    })
    .use(async ({ approvalRes, mapMethod, request, ethRpc }) => {
      // process request
      const { uiRequestComponent, ...rest } = approvalRes || {};

      const requestDeffer = ethRpc
        ? providerController.ethRpc(request)
        : Promise.resolve(
            providerController[mapMethod]({
              ...request,
              approvalRes,
            })
          );

      const {
        session: { origin },
      } = request;

      if (uiRequestComponent) {
        return await notificationService.requestApproval({
          aporovalComponent: uiRequestComponent,
          requestDeffer,
          params: rest,
          origin,
        });
      }

      return requestDeffer;
    })
    .handle(req);
