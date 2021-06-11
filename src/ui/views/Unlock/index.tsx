import React, { useEffect, useRef } from 'react';
import { Input, Form, Button } from 'antd';
import { useWallet, useApproval } from 'ui/utils';

import './style.less';

const Unlock = () => {
  const wallet = useWallet();
  const [, resolveApproval] = useApproval();
  const [form] = Form.useForm();
  const inputEl = useRef<Input>(null);

  useEffect(() => {
    if (!inputEl.current) return;
    inputEl.current.focus();
  }, []);

  const onSubmit = async ({ password }) => {
    try {
      await wallet.unlock(password);
      resolveApproval();
    } catch (err) {
      form.setFields([
        {
          name: 'password',
          errors: [err?.message || 'incorrect password'],
        },
      ]);
    }
  };

  return (
    <div className="unlock">
      <div className="header pt-[304px] text-center text-white text-20">
        A browser plugin for DeFi users
      </div>
      <Form className="bg-gray-bg flex-1" form={form} onFinish={onSubmit}>
        <Form.Item
          className="mt-[34px] mx-28"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input Password',
            },
          ]}
        >
          <Input
            placeholder="Password"
            size="large"
            type="password"
            ref={inputEl}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="w-[200px] block mx-auto mt-18"
            htmlType="submit"
            type="primary"
            size="large"
          >
            Unlock
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Unlock;
