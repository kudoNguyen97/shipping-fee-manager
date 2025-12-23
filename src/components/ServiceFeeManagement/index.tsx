import { useState } from 'react';
import { Tabs, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { AddTabModal } from './AddTabModal';
import { ServiceFeeCardComponent } from './ServiceFeeCard';
import { ServiceFeeTab, ServiceFeeCard, ServiceFee } from '@/types/serviceFee';
import { mockServiceFeesData } from '@/data/mockData';

export const ServiceFeeManagement = () => {
    // Ensure mock/sample data has stable ids for each service fee so React keys
    // are unique on first render (prevents duplicate key warnings).
    const normalizeInitialTabs = (
        rawTabs: ServiceFeeTab[],
    ): ServiceFeeTab[] => {
        const base = Date.now();
        return rawTabs.map((tab, ti) => ({
            ...tab,
            cards: tab.cards.map((card, ci) => ({
                ...card,
                id: card.id || `card_${base}_${ti}_${ci}`,
                serviceFees: card.serviceFees.map((sf, i) => ({
                    id:
                        sf.id ??
                        `init_${base}_${ti}_${ci}_${i}_${Math.random()
                            .toString(36)
                            .slice(2, 6)}`,
                    ...sf,
                })),
            })),
        }));
    };

    const [tabs, setTabs] = useState<ServiceFeeTab[]>(() =>
        normalizeInitialTabs(mockServiceFeesData.serviceFeesByDeliveryScope),
    );
    const [activeKey, setActiveKey] = useState<string>(
        mockServiceFeesData.serviceFeesByDeliveryScope[0]?.nameTab || '',
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTab = (values: {
        fromCountry: string;
        toCountry: string;
    }) => {
        // Check if country combination already exists
        if (
            tabs.some(
                (tab) =>
                    tab.fromCountry === values.fromCountry &&
                    tab.toCountry === values.toCountry,
            )
        ) {
            message.error('Tab with this country combination already exists!');
            return;
        }

        const serviceType =
            values.fromCountry === values.toCountry
                ? 'Domestic'
                : 'International';
        const generatedNameTab = `${serviceType} (${values.fromCountry} - ${values.toCountry})`;

        const newTab: ServiceFeeTab = {
            nameTab: generatedNameTab,
            fromCountry: values.fromCountry,
            toCountry: values.toCountry,
            cards: [],
        };

        setTabs([...tabs, newTab]);
        setActiveKey(newTab.nameTab);
        setIsModalOpen(false);
        message.success('Tab added successfully!');
    };

    const handleRemoveTab = (targetKey: string) => {
        const newTabs = tabs.filter((tab) => tab.nameTab !== targetKey);
        setTabs(newTabs);

        if (activeKey === targetKey && newTabs.length > 0) {
            setActiveKey(newTabs[0].nameTab);
        }

        message.success('Tab removed successfully!');
    };

    const handleAddCard = (tabName: string) => {
        const timestamp = Date.now();
        const newCard: ServiceFeeCard = {
            id: `card_${timestamp}`,
            cities: [],
            currency: 'USD',
            serviceFees: [],
        };

        setTabs(
            tabs.map((tab) =>
                tab.nameTab === tabName
                    ? { ...tab, cards: [...tab.cards, newCard] }
                    : tab,
            ),
        );
        message.success('Card added successfully!');
    };

    const handleUpdateCard = (
        tabName: string,
        cardId: string,
        updatedCard: ServiceFeeCard,
    ) => {
        setTabs(
            tabs.map((tab) =>
                tab.nameTab === tabName
                    ? {
                          ...tab,
                          cards: tab.cards.map((card) =>
                              card.id === cardId ? updatedCard : card,
                          ),
                      }
                    : tab,
            ),
        );
    };

    const handleRemoveCard = (tabName: string, cardId: string) => {
        setTabs(
            tabs.map((tab) =>
                tab.nameTab === tabName
                    ? {
                          ...tab,
                          cards: tab.cards.filter((card) => card.id !== cardId),
                      }
                    : tab,
            ),
        );
        message.success('Card removed successfully!');
    };

    const handleSave = () => {
        // Simulate API call to save/update data
        const payload = {
            serviceFeesByDeliveryScope: tabs,
        };

        console.log('Saving data:', payload);
        message.success('Data saved successfully!');

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
            <div className="p-4 space-y-4">
                <div className="flex justify-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddCard(tab.nameTab)}
                    >
                        Add Card
                    </Button>
                </div>

                {tab.cards.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No cards yet. Click "Add Card" to create one.</p>
                    </div>
                ) : (
                    tab.cards.map((card) => (
                        <ServiceFeeCardComponent
                            key={card.id}
                            card={card}
                            onUpdate={(updatedCard) =>
                                handleUpdateCard(tab.nameTab, card.id, updatedCard)
                            }
                            onRemove={() => handleRemoveCard(tab.nameTab, card.id)}
                        />
                    ))
                )}
            </div>
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
                            Manage shipping service pricing across different
                            delivery scopes
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
