import { Modal, Form, Select } from "antd";

interface AddTabModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: { fromCountry: string; toCountry: string }) => void;
}

const countryOptions = [
  { label: "VN", value: "VN" },
  { label: "US", value: "US" },
  { label: "CN", value: "CN" },
];

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
          name="fromCountry"
          label="From Country"
          rules={[{ required: true, message: "Please select from country!" }]}
        >
          <Select placeholder="Select from country" options={countryOptions} />
        </Form.Item>

        <Form.Item
          name="toCountry"
          label="To Country"
          rules={[{ required: true, message: "Please select to country!" }]}
        >
          <Select placeholder="Select to country" options={countryOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
