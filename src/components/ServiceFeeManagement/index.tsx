import { useState } from "react";
import { Tabs, Button, Popconfirm, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { AddTabModal } from "./AddTabModal";
import { ServiceFeeTable } from "./ServiceFeeTable";
import { ServiceFeeTab } from "@/types/serviceFee";
import { mockServiceFeesData } from "@/data/mockData";

export const ServiceFeeManagement = () => {
  const [tabs, setTabs] = useState<ServiceFeeTab[]>(
    mockServiceFeesData.serviceFeesByDeliveryScope
  );
  const [activeKey, setActiveKey] = useState<string>(
    mockServiceFeesData.serviceFeesByDeliveryScope[0]?.nameTab || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTab = (values: { fromCountry: string; toCountry: string; currency: string }) => {
    const serviceType = values.fromCountry === values.toCountry ? "Domestic" : "International";
    const generatedNameTab = `${serviceType} (${values.fromCountry} - ${values.toCountry})`;
    
    const newTab: ServiceFeeTab = {
      nameTab: generatedNameTab,
      fromCountry: values.fromCountry,
      toCountry: values.toCountry,
      currency: values.currency,
      serviceFees: [],
    };

    // Check if tab name already exists
    if (tabs.some((tab) => tab.nameTab === generatedNameTab)) {
      message.error("Tab with this country combination already exists!");
      return;
    }

    setTabs([...tabs, newTab]);
    setActiveKey(newTab.nameTab);
    setIsModalOpen(false);
    message.success("Tab added successfully!");
  };

  const handleRemoveTab = (targetKey: string) => {
    const newTabs = tabs.filter((tab) => tab.nameTab !== targetKey);
    setTabs(newTabs);
    
    if (activeKey === targetKey && newTabs.length > 0) {
      setActiveKey(newTabs[0].nameTab);
    }
    
    message.success("Tab removed successfully!");
  };

  const handleServiceFeesChange = (tabName: string, newServiceFees: any[]) => {
    setTabs(
      tabs.map((tab) =>
        tab.nameTab === tabName ? { ...tab, serviceFees: newServiceFees } : tab
      )
    );
  };

  const handleCurrencyChange = (tabName: string, newCurrency: string) => {
    setTabs(
      tabs.map((tab) =>
        tab.nameTab === tabName ? { ...tab, currency: newCurrency } : tab
      )
    );
  };

  const handleSave = () => {
    // Simulate API call to save/update data
    const payload = {
      serviceFeesByDeliveryScope: tabs,
    };
    
    console.log("Saving data:", payload);
    message.success("Data saved successfully!");
    
    // Here you would call your actual API
    // createOrUpdateServiceFees(payload);
  };

  const tabItems = tabs.map((tab) => ({
    key: tab.nameTab,
    label: (
      <span className="flex items-center gap-2">
        {tab.nameTab}
        <Popconfirm
          title="Remove this tab?"
          onConfirm={(e) => {
            e?.stopPropagation();
            handleRemoveTab(tab.nameTab);
          }}
          okText="Yes"
          cancelText="No"
          onCancel={(e) => e?.stopPropagation()}
        >
          <CloseOutlined
            className="text-muted-foreground hover:text-destructive"
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      </span>
    ),
    children: (
      <ServiceFeeTable
        data={tab.serviceFees}
        currency={tab.currency}
        onChange={(newData) => handleServiceFeesChange(tab.nameTab, newData)}
        onCurrencyChange={(newCurrency) => handleCurrencyChange(tab.nameTab, newCurrency)}
      />
    ),
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Service Fee Management
            </h1>
            <p className="text-muted-foreground">
              Manage shipping service pricing across different delivery scopes
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              size="large"
            >
              Add Tab
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              size="large"
              className="bg-success hover:bg-success/90"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm">
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={tabItems}
            type="card"
            className="px-4"
          />
        </div>

        <AddTabModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleAddTab}
        />
      </div>
    </div>
  );
};
