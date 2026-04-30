import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  [{ script: 'sub' }, { script: 'super' }],
  ['clean'],
];

const QuillField = ({ name, label, required, initialValue }) => {
  const form = Form.useFormInstance();
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    form.setFieldsValue({ [name]: value });
  }, [value, form, name]);

  useEffect(() => {
    const initial = form.getFieldValue(name);
    if (initial !== undefined && initial !== value) {
      setValue(initial);
    }
  }, [form, name, value]);

  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true }] : []}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{ toolbar: toolbarOptions }}
        placeholder={`Введите ${label?.toLowerCase()}...`}
        style={{ height: '550px', marginBottom: '16px' }}
      />
    </Form.Item>
  );
};

export default QuillField;
