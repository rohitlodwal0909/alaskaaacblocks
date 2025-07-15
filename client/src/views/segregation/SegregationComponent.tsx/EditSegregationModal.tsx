import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateSegregation, GetSegregation } from 'src/features/Segregation/SegregationSlice';
// import { Icon } from '@iconify/react';

const EditSegregationModal = ({ show, setShowmodal, autoclave }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    mould_no: '',
    operator_name: '',
    size: '',
    no_of_broken_pcs: '',
    no_of_ok_pcs: '',
    remark: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const segData = autoclave?.segregation_entries?.[0];
    if (segData) {
      setFormData({
        id: segData?.id || '',
        mould_no: segData?.mould_no || '',
        operator_name: segData?.operator_name || '',
        size: segData?.size || '',
        no_of_broken_pcs: segData?.no_of_broken_pcs || '',
        no_of_ok_pcs: segData?.no_of_ok_pcs || '',
        remark: segData?.remark || '',
      });
    }
  }, [autoclave]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['operator_name', 'size', 'no_of_broken_pcs', 'no_of_ok_pcs'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateSegregation(formData)).unwrap();
      toast.success(result.message || 'Segregation entry updated successfully');
      dispatch(GetSegregation());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update segregation entry');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Segregation Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {/* Operator Name */}
          <div className="col-span-6">
            <Label value="Operator Name" />
            <TextInput
              id="operator_name"
              value={formData.operator_name}
              onChange={(e) => handleChange('operator_name', e.target.value)}
              placeholder="Enter operator name"
              className="form-rounded-md"
              color={errors.operator_name ? 'failure' : 'gray'}
            />
            {errors.operator_name && (
              <p className="text-red-500 text-xs">{errors.operator_name}</p>
            )}
          </div>

          {/* Size */}
          <div className="col-span-6">
            <Label value="Size" />
            <TextInput
              id="size"
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
              placeholder="Enter size"
              className="form-rounded-md"
              color={errors.size ? 'failure' : 'gray'}
            />
            {errors.size && <p className="text-red-500 text-xs">{errors.size}</p>}
          </div>

          {/* No of OK Pcs */}
          <div className="col-span-6">
            <Label value="No of OK Pcs" />
            <TextInput
              type="number"
              id="no_of_ok_pcs"
              value={formData.no_of_ok_pcs}
              onChange={(e) => handleChange('no_of_ok_pcs', e.target.value)}
              placeholder="Enter no of OK pcs"
              className="form-rounded-md"
              color={errors.no_of_ok_pcs ? 'failure' : 'gray'}
            />
            {errors.no_of_ok_pcs && (
              <p className="text-red-500 text-xs">{errors.no_of_ok_pcs}</p>
            )}
          </div>

          {/* No of Broken Pcs */}
          <div className="col-span-6">
            <Label value="No of Broken Pcs" />
            <TextInput
              type="number"
              id="no_of_broken_pcs"
              value={formData.no_of_broken_pcs}
              onChange={(e) => handleChange('no_of_broken_pcs', e.target.value)}
              placeholder="Enter no of broken pcs"
              className="form-rounded-md"
              color={errors.no_of_broken_pcs ? 'failure' : 'gray'}
            />
            {errors.no_of_broken_pcs && (
              <p className="text-red-500 text-xs">{errors.no_of_broken_pcs}</p>
            )}
          </div>

          {/* Remark */}
          <div className="col-span-12">
            <Label value="Remark" />
            <textarea
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
              placeholder="Any notes or comments"
              rows={2}
              className="w-full border rounded-md p-2 border-gray-300"
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Update</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditSegregationModal;
