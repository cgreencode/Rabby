import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { APPROVAL_STATE } from 'constants';
import { Footer, Button } from 'popup/component';
import { useEth, useApproval } from 'popup/utils';
import { Connect, Sign } from './components';

const Approval = () => {
  const history = useHistory();
  const [account, setAccount] = useState('');
  const eth = useEth();
  const [approval, handleNext] = useApproval();

  const init = async () => {
    const account = await eth.getAccount();
    setAccount(account);
  }

  useEffect(() => {
    init();
  }, [account]);

  const handleCancel = () => {
    handleNext(true);
  }

  const handleAllow = () => {
    handleNext(null, true);
  }

  const Content = approval?.state === APPROVAL_STATE.CONNECT ? Connect :
    approval?.state === APPROVAL_STATE.SIGN ? Sign : null;

  return <>
    <div className="absolute top-0 left-0 w-full py-2 px-4 bg-primary text-white">
      <div className="text-xs">Current account</div>
      <div>{account}</div>
    </div>
    { Content && <Content params={approval.params} />}
    <Footer className="flex space-x-4">
      <Button block onClick={handleCancel}>Cancel</Button>
      <Button block onClick={handleAllow}>Allow</Button>
    </Footer>
  </>
}

export default Approval;
