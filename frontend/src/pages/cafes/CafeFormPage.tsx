import { useEffect, useState } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Upload, message, Modal } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCafes, useCreateCafe, useUpdateCafe } from '@/hooks/useCafes';
import { cafeSchema, type CafeFormValues } from '@/schemas/cafeSchema';
import AppTextInput from '@/components/AppTextInput';
import styles from './CafeFormPage.module.css';

export default function CafeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { data: cafes } = useCafes();
  const existing = cafes?.find((c) => c.id === id);

  const { mutate: createCafe, isPending: isCreating } = useCreateCafe();
  const { mutate: updateCafe, isPending: isUpdating } = useUpdateCafe();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CafeFormValues>({
    resolver: zodResolver(cafeSchema),
    defaultValues: { name: '', description: '', location: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({ name: existing.name, description: existing.description, location: existing.location });
    }
  }, [existing, reset]);

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    isDirty && currentLocation.pathname !== nextLocation.pathname,
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

  const onSubmit = (values: CafeFormValues) => {
    if (logoError) return;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('location', values.location);
    if (logoFile) formData.append('logo', logoFile);

    if (isEditMode && id) {
      updateCafe(
        { id, data: formData },
        {
          onSuccess: () => {
            reset();
            message.success('Café updated');
            setTimeout(() => navigate('/cafes'), 0);
          },
          onError: (err) => message.error(err.message),
        },
      );
    } else {
      createCafe(formData, {
        onSuccess: () => {
          reset();
          message.success('Café created');
          setTimeout(() => navigate('/cafes'), 0);
        },
        onError: (err) => message.error(err.message),
      });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/cafes')} />
        <h1 className={styles.title}>{isEditMode ? 'Edit Café' : 'Add New Café'}</h1>
      </div>

      <Form layout="vertical" className={styles.form} onFinish={handleSubmit(onSubmit)}>
        <AppTextInput name="name" control={control} label="Name" placeholder="Min 6, max 10 characters" error={errors.name} />
        <AppTextInput name="description" control={control} label="Description" placeholder="Max 256 characters" error={errors.description} />
        <AppTextInput name="location" control={control} label="Location" placeholder="e.g. CBD, Tampines" error={errors.location} />

        <Form.Item label="Logo (optional)" validateStatus={logoError ? 'error' : ''} help={logoError}>
          {existing?.logo && !logoFile && (
            <img src={`/${existing.logo}`} alt="logo" className={styles.preview} />
          )}
          <Upload
            beforeUpload={(file) => {
              if (file.size > 2 * 1024 * 1024) {
                setLogoError('Logo must be smaller than 2MB');
                return Upload.LIST_IGNORE;
              }
              setLogoError('');
              setLogoFile(file);
              return false;
            }}
            maxCount={1}
            accept="image/jpeg,image/png,image/gif"
          >
            <Button icon={<UploadOutlined />}>Select Logo</Button>
          </Upload>
        </Form.Item>

        <div className={styles.actions}>
          <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
            {isEditMode ? 'Update Café' : 'Create Café'}
          </Button>
          <Button onClick={() => navigate('/cafes')}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}
