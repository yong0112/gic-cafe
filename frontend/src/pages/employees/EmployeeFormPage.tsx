import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Radio, Select, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEmployees, useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';
import { useCafes } from '@/hooks/useCafes';
import { employeeSchema, type EmployeeFormValues } from '@/schemas/employeeSchema';
import AppTextInput from '@/components/AppTextInput';
import styles from './EmployeeFormPage.module.css';

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  const { data: employees } = useEmployees();
  const { data: cafes = [] } = useCafes();
  const existing = employees?.find((e) => e.id === id);

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: '', emailAddress: '', phoneNumber: '', gender: 'Male', cafeId: '' },
  });

  useEffect(() => {
    if (existing && cafes.length > 0) {
      const assignedCafe = cafes.find((c) => c.name === existing.cafe);
      reset({
        name: existing.name,
        emailAddress: existing.email_address,
        phoneNumber: existing.phone_number,
        gender: existing.gender,
        cafeId: assignedCafe?.id ?? '',
      });
    }
  }, [existing, cafes, reset]);

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    isDirty && !submittedRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: 'Unsaved changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        onOk: () => blocker.proceed(),
        onCancel: () => blocker.reset(),
      });
    }
  }, [blocker]);

  const onSubmit = (values: EmployeeFormValues) => {
    const payload = {
      name: values.name,
      emailAddress: values.emailAddress,
      phoneNumber: values.phoneNumber,
      gender: values.gender,
      cafeId: values.cafeId || null,
    };

    if (isEditMode && id) {
      updateEmployee(
        { id, data: payload },
        {
          onSuccess: () => {
            submittedRef.current = true;
            reset();
            message.success('Employee updated');
            setTimeout(() => navigate('/employees'), 0);
          },
          onError: (err) => message.error(err.message),
        },
      );
    } else {
      createEmployee(payload, {
        onSuccess: () => {
          submittedRef.current = true;
          reset();
          message.success('Employee created');
          setTimeout(() => navigate('/employees'), 0);
        },
        onError: (err) => message.error(err.message),
      });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/employees')} />
        <h1 className={styles.title}>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
      </div>

      <Form layout="vertical" className={styles.form} onFinish={handleSubmit(onSubmit)}>
        <AppTextInput name="name" control={control} label="Name" placeholder="Min 6, max 10 characters" error={errors.name} />
        <AppTextInput name="emailAddress" control={control} label="Email Address" placeholder="email@example.com" error={errors.emailAddress} />
        <AppTextInput name="phoneNumber" control={control} label="Phone Number" placeholder="8XXXXXXX or 9XXXXXXX" error={errors.phoneNumber} />

        <Form.Item label="Gender" validateStatus={errors.gender ? 'error' : ''} help={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item label="Assigned Café (optional)" validateStatus={errors.cafeId ? 'error' : ''} help={errors.cafeId?.message}>
          <Controller
            name="cafeId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select a café"
                allowClear
                onClear={() => field.onChange('')}
                options={cafes.map((c) => ({ value: c.id, label: c.name }))}
              />
            )}
          />
        </Form.Item>

        <div className={styles.actions}>
          <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
            {isEditMode ? 'Update Employee' : 'Create Employee'}
          </Button>
          <Button onClick={() => navigate('/employees')}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}
