import { Modal, Form, Input } from "antd";

interface AddTabModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: { nameTab: string; currency: string }) => void;
}

export const AddTabModal = ({ open, onCancel, onOk }: AddTabModalProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add New Tab"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          name="nameTab"
          label="Tab Name"
          rules={[{ required: true, message: "Please input tab name!" }]}
        >
          <Input placeholder="Enter tab name" />
        </Form.Item>

        <Form.Item
          name="currency"
          label="Currency"
          rules={[{ required: true, message: "Please input currency!" }]}
        >
          <Input placeholder="e.g., VND, USD, EUR" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
