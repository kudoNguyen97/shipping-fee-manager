import { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Input, Select, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ServiceFee } from '@/types/serviceFee';
import type { ColumnType } from 'antd/es/table';

// Helper function to format enum-like text to human-readable format
const formatEnumText = (text: string): string => {
    if (!text) return '';
    return text
        .split('_')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
};

interface ServiceFeeTableProps {
    data: ServiceFee[];
    currency: string;
    onChange: (data: ServiceFee[]) => void;
}

export const ServiceFeeTable = ({
    data,
    currency,
    onChange,
}: ServiceFeeTableProps) => {
    const [editingKey, setEditingKey] = useState<string>('');
    const [editingField, setEditingField] = useState<keyof ServiceFee | ''>('');

    const isEditing = (record: ServiceFee, field: keyof ServiceFee) => {
        const key =
            record.id ??
            `${record.serviceType}_${record.zoneFromCode}_${record.zoneToCode}`;
        return editingKey === key && editingField === field;
    };

    const handleCellClick = (record: ServiceFee, field: keyof ServiceFee) => {
        const key =
            record.id ??
            `${record.serviceType}_${record.zoneFromCode}_${record.zoneToCode}`;
        setEditingKey(key);
        setEditingField(field);
    };

    const handleSave = (
        record: ServiceFee,
        field: keyof ServiceFee,
        value: string | number | Record<string, number> | undefined,
    ) => {
        const newData = [...data];
        const index = record.id
            ? newData.findIndex((item) => item.id === record.id)
            : newData.findIndex(
                  (item) =>
                      item.serviceType === record.serviceType &&
                      item.zoneFromCode === record.zoneFromCode &&
                      item.zoneToCode === record.zoneToCode,
              );
        if (index > -1) {
            newData[index] = { ...newData[index], [field]: value };
            onChange(newData);
        }
        setEditingKey('');
        setEditingField('');
    };

    const handleAddRow = () => {
        const timestamp = Date.now();
        const newRow: ServiceFee = {
            serviceType: 'NEW_SERVICE',
            calcFeeType: 'CALCULATE_FEE_TYPE_UNSPECIFIED',
            fee: 0,
            weightFrom: 0,
            weightTo: 0,
            distanceFrom: 0,
            distanceTo: 0,
            packageType: 'PACKAGE_TYPE_UNSPECIFIED',
            category: 'CATEGORY_OF_SHIPMENT_UNSPECIFIED',
            id: `temp_${timestamp}`,
            zoneFromCode: `temp_${timestamp}`,
            zoneToCode: '',
            shippingType: 'SHIPPING_TYPE_UNSPECIFIED',
            calcCondition: 'CALC_CONDITION_UNSPECIFIED',
        };
        onChange([...data, newRow]);
    };

    // Note: incoming data should already be normalized with stable `id`s. The
    // parent (`ServiceFeeManagement`) assigns ids on initialization to avoid
    // duplicate-key warnings during first render.

    const handleDeleteRow = (record: ServiceFee) => {
        const newData = record.id
            ? data.filter((item) => item.id !== record.id)
            : data.filter(
                  (item) =>
                      !(
                          item.serviceType === record.serviceType &&
                          item.zoneFromCode === record.zoneFromCode &&
                          item.zoneToCode === record.zoneToCode
                      ),
              );
        onChange(newData);
    };

    const EditableCell = ({
        record,
        field,
        type = 'text',
        children,
    }: {
        record: ServiceFee;
        field: keyof ServiceFee;
        type?: 'text' | 'number' | 'select';
        children: React.ReactNode;
    }) => {
        const editing = isEditing(record, field);
        const [localValue, setLocalValue] = useState<
            string | number | Record<string, number> | undefined
        >(
            record[field] as unknown as
                | string
                | number
                | Record<string, number>
                | undefined,
        );

        useEffect(() => {
            if (editing) {
                setLocalValue(record[field]);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [editing]);

        if (!editing) {
            return (
                <div
                    onClick={() => handleCellClick(record, field)}
                    className="cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded"
                >
                    {children}
                </div>
            );
        }

        if (type === 'number') {
            return (
                <InputNumber
                    autoFocus
                    value={localValue as number}
                    onChange={(v) => setLocalValue(v)}
                    onBlur={() =>
                        handleSave(record, field, Number(localValue) || 0)
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSave(record, field, Number(localValue) || 0);
                        }
                    }}
                    className="w-full"
                />
            );
        }

        if (type === 'select') {
            const options = [
                'SERVICE_TYPE_UNSPECIFIED',
                'EXPRESS',
                'STANDARD',
                'EXPRESS_INTERNATIONAL',
            ];
            return (
                <Select
                    autoFocus
                    value={localValue as string}
                    onChange={(value) => {
                        handleSave(record, field, value);
                    }}
                    onBlur={() => {
                        setEditingKey('');
                        setEditingField('');
                    }}
                    className="w-full"
                    options={options.map((opt) => ({
                        label: formatEnumText(opt),
                        value: opt,
                    }))}
                />
            );
        }

        return (
            <Input
                autoFocus
                value={localValue as string}
                onChange={(e) => setLocalValue(e.target.value)}
                onPressEnter={() =>
                    handleSave(record, field, (localValue as string) || '')
                }
                onBlur={() =>
                    handleSave(record, field, (localValue as string) || '')
                }
            />
        );
    };

    const columns: ColumnType<ServiceFee>[] = [
        {
            title: 'Service Type',
            dataIndex: 'serviceType',
            key: 'serviceType',
            width: 180,
            render: (text, record) => (
                <EditableCell record={record} field="serviceType" type="select">
                    {formatEnumText(text)}
                </EditableCell>
            ),
        },
        {
            title: 'Calc Fee Type',
            dataIndex: 'calcFeeType',
            key: 'calcFeeType',
            width: 160,
            render: (text, record) => (
                <EditableCell record={record} field="calcFeeType">
                    {formatEnumText(text)}
                </EditableCell>
            ),
        },
        {
            title: `Fee (${currency})`,
            dataIndex: 'fee',
            key: 'fee',
            width: 120,
            render: (text, record) => (
                <EditableCell record={record} field="fee" type="number">
                    {text?.toLocaleString()}
                </EditableCell>
            ),
        },
        {
            title: 'Weight From (kg)',
            dataIndex: 'weightFrom',
            key: 'weightFrom',
            width: 140,
            render: (text, record) => (
                <EditableCell record={record} field="weightFrom" type="number">
                    {text}
                </EditableCell>
            ),
        },
        {
            title: 'Weight To (kg)',
            dataIndex: 'weightTo',
            key: 'weightTo',
            width: 130,
            render: (text, record) => (
                <EditableCell record={record} field="weightTo" type="number">
                    {text}
                </EditableCell>
            ),
        },
        {
            title: 'Distance From (km)',
            dataIndex: 'distanceFrom',
            key: 'distanceFrom',
            width: 160,
            render: (text, record) => (
                <EditableCell
                    record={record}
                    field="distanceFrom"
                    type="number"
                >
                    {text}
                </EditableCell>
            ),
        },
        {
            title: 'Distance To (km)',
            dataIndex: 'distanceTo',
            key: 'distanceTo',
            width: 150,
            render: (text, record) => (
                <EditableCell record={record} field="distanceTo" type="number">
                    {text}
                </EditableCell>
            ),
        },
        {
            title: 'Package Type',
            dataIndex: 'packageType',
            key: 'packageType',
            width: 150,
            render: (text, record) => (
                <EditableCell record={record} field="packageType">
                    {formatEnumText(text)}
                </EditableCell>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 180,
            render: (text, record) => (
                <EditableCell record={record} field="category">
                    {formatEnumText(text)}
                </EditableCell>
            ),
        },
        {
            title: 'Zone From',
            dataIndex: 'zoneFromCode',
            key: 'zoneFromCode',
            width: 120,
            render: (text, record) => (
                <EditableCell record={record} field="zoneFromCode">
                    {text}
                </EditableCell>
            ),
        },
        {
            title: 'Zone To',
            dataIndex: 'zoneToCode',
            key: 'zoneToCode',
            width: 120,
            render: (text, record) => (
                <EditableCell record={record} field="zoneToCode">
                    {text}
                </EditableCell>
            ),
        },
        {
            title: 'Shipping Type',
            dataIndex: 'shippingType',
            key: 'shippingType',
            width: 150,
            render: (text, record) => (
                <EditableCell record={record} field="shippingType">
                    {formatEnumText(text)}
                </EditableCell>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Popconfirm
                    title="Delete this row?"
                    onConfirm={() => handleDeleteRow(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">
                    Service Fee Table
                </h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddRow}
                >
                    Add Row
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) =>
                    record.id ??
                    `${record.serviceType}_${record.zoneFromCode}_${record.zoneToCode}`
                }
                scroll={{ x: 2000 }}
                pagination={{ pageSize: 10 }}
                bordered
            />
        </div>
    );
};
