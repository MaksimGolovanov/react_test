import React from 'react'
import { Modal, Form, Input, Select, Button, Space, AutoComplete } from 'antd'

const CardModal = ({ 
    show, 
    onHide, 
    currentCard, 
    form,
    onFinish,
    onClearFio,
    fioSuggestions = [],
    staffData = [],
    formData,
    onValuesChange
}) => {
    const findStaffByFio = (fio) => {
        if (!fio || !staffData) return null
        return staffData.find((staff) => staff.fio?.toLowerCase() === fio.toLowerCase())
    }

    const handleFioChange = (value) => {
        const staffMember = findStaffByFio(value)
        if (staffMember) {
            const department = staffMember.department ? staffMember.department.substring(13) : ''
            form.setFieldsValue({ department })
        }
    }

    return (
        <Modal
            title={currentCard ? 'Редактирование карты доступа' : 'Добавление новой карты доступа'}
            open={show}
            onCancel={onHide}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={formData}
                onValuesChange={onValuesChange}
            >
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <Form.Item
                            label="Серийный номер"
                            name="ser_num"
                            rules={[{ required: true, message: 'Пожалуйста, введите серийный номер' }]}
                        >
                            <Input placeholder="Введите серийный номер" />
                        </Form.Item>

                        <Form.Item
                            label="Тип"
                            name="type"
                        >
                            <Select placeholder="Выберите тип">
                                <Select.Option value="">Не выбран</Select.Option>
                                <Select.Option value="eToken PRO">eToken PRO</Select.Option>
                                <Select.Option value="JaCarta PRO">JaCarta PRO</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Описание"
                            name="description"
                        >
                            <Select placeholder="Выберите описание">
                                <Select.Option value="">Не выбрано</Select.Option>
                                <Select.Option value="Шаблон SEVZ">Шаблон SEVZ</Select.Option>
                                <Select.Option value="Шаблон CNTR">Шаблон CNTR</Select.Option>
                                <Select.Option value="ЭЦП">ЭЦП</Select.Option>
                                <Select.Option value="ЭЦП ФЛ">ЭЦП ФЛ</Select.Option>
                                <Select.Option value="ЭЦП ФЛ Контур">ЭЦП ФЛ "Контур"</Select.Option>
                                <Select.Option value="ЭЦП ФЛ Directum RX">ЭЦП ФЛ "Directum RX"</Select.Option>
                                <Select.Option value="ЭЦП ФЛ Резерв">ЭЦП ФЛ "Резерв"</Select.Option>
                                <Select.Option value="ЭЦП ФЛ ГПБ">ЭЦП ФЛ "ГПБ"</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Form.Item
                            label={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>ФИО</span>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={onClearFio}
                                        disabled={!formData?.fio && !formData?.department}
                                    >
                                        Очистить
                                    </Button>
                                </div>
                            }
                            name="fio"
                        >
                            <AutoComplete
                                options={fioSuggestions.map(fio => ({ value: fio }))}
                                placeholder="Начните вводить ФИО..."
                                filterOption={(inputValue, option) =>
                                    option.value.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                onChange={handleFioChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Служба"
                            name="department"
                        >
                            <Input readOnly placeholder="Заполнится автоматически" />
                        </Form.Item>

                        <Form.Item
                            label="Дата проверки"
                            name="data_prov"
                        >
                            <Input type="date" />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    label="В работе"
                    name="log"
                    initialValue="Да"
                >
                    <Select>
                        <Select.Option value="Да">Да</Select.Option>
                        <Select.Option value="Нет">Нет</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Space style={{ float: 'right' }}>
                        <Button onClick={onHide}>Отмена</Button>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CardModal