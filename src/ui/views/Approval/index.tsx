import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { APPROVAL_STATE } from 'consts';
import { Footer } from 'ui/component';
import { useWallet, useApproval } from 'ui/utils';
import { Connect, SignText, SignTx } from './components';

const Approval = () => {
  const history = useHistory();
  const [account, setAccount] = useState('');
  const wallet = useWallet();
  const [approval, resolveApproval, rejectApproval] = useApproval();

  if (!approval) {
    history.replace('/');
    return null;
  }

  const init = async () => {
    const account = await wallet.getCurrentAccount();
    setAccount(account);
  };

  useEffect(() => {
    init();
  }, [account]);

  const handleCancel = () => {
    rejectApproval('user reject');
  };

  const handleAllow = () => {
    resolveApproval();
  };

  const Content =
    approval?.state === APPROVAL_STATE.CONNECT
      ? Connect
      : approval?.state === APPROVAL_STATE.SIGN
      ? approval?.params.gas
        ? SignTx
        : SignText
      : null;

  return (
    <>
      <div className="absolute top-0 left-0 w-full py-2 px-4 bg-primary text-white">
        <div className="text-xs">Current account</div>
        <div>{account}</div>
      </div>
      {Content && <Content params={approval.params} origin={approval.origin} />}
      <Footer className="flex space-x-4">
        <Button type="primary" block onClick={handleCancel}>
          Cancel
        </Button>
        <Button block onClick={handleAllow}>
          Allow
        </Button>
      </Footer>
    </>
  );
};

export default Approval;
