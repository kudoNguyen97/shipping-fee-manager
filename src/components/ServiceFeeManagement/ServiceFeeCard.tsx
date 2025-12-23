import { Button, Select, Popconfirm, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ServiceFeeCard as ServiceFeeCardType, ServiceFee } from '@/types/serviceFee';
import { ServiceFeeTable } from './ServiceFeeTable';

const CITY_OPTIONS = [
    { label: 'Hanoi', value: 'HN' },
    { label: 'Ho Chi Minh', value: 'HCM' },
    { label: 'Da Nang', value: 'DN' },
    { label: 'Hai Phong', value: 'HP' },
    { label: 'Can Tho', value: 'CT' },
    { label: 'New York', value: 'NYC' },
    { label: 'Los Angeles', value: 'LA' },
    { label: 'Chicago', value: 'CHI' },
    { label: 'Beijing', value: 'BJ' },
    { label: 'Shanghai', value: 'SH' },
    { label: 'Guangzhou', value: 'GZ' },
];

interface ServiceFeeCardProps {
    card: ServiceFeeCardType;
    onUpdate: (updatedCard: ServiceFeeCardType) => void;
    onRemove: () => void;
}

export const ServiceFeeCardComponent = ({
    card,
    onUpdate,
    onRemove,
}: ServiceFeeCardProps) => {
    const handleCitiesChange = (cities: string[]) => {
        onUpdate({ ...card, cities });
    };

    const handleCurrencyChange = (currency: string) => {
        onUpdate({ ...card, currency });
    };

    const handleServiceFeesChange = (serviceFees: ServiceFee[]) => {
        onUpdate({ ...card, serviceFees });
    };

    return (
        <Card
            className="mb-4 shadow-sm"
            title={
                <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">
                        Service Fee Card
                    </span>
                    <Popconfirm
                        title="Remove this card?"
                        description="All service fees in this card will be deleted."
                        onConfirm={onRemove}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Remove Card
                        </Button>
                    </Popconfirm>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Cities Selection Section */}
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <label className="text-sm font-medium text-foreground min-w-[80px]">
                        Cities:
                    </label>
                    <Select
                        mode="multiple"
                        value={card.cities}
                        onChange={handleCitiesChange}
                        options={CITY_OPTIONS}
                        placeholder="Select cities"
                        className="flex-1"
                        maxTagCount="responsive"
                    />
                </div>

                {/* Service Fee Table Section */}
                <ServiceFeeTable
                    data={card.serviceFees}
                    currency={card.currency}
                    onChange={handleServiceFeesChange}
                    onCurrencyChange={handleCurrencyChange}
                />
            </div>
        </Card>
    );
};
