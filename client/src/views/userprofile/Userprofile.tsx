import { useEffect, useRef, useState } from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { toast } from 'react-toastify';
import userImg from 'src/assets/images/profile/user-1.jpg';
import CardBox from 'src/components/shared/CardBox';
import { AuthenticationUpdatemodule, GetAuthenticationmodule } from 'src/features/authentication/AuthenticationSlice';

const roleOptions = [
  { id: '1', label: 'Manager' },
  { id: '2', label: 'Employee' },
  { id: '3', label: 'Guard' },
];
interface FormDataType {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  role_id: string;
}

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication.logindata) as {
  user?: Partial<FormDataType>;
};
const user = logindata?.user ?? {};
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(userImg);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    role_id: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('logincheck') || '{}');
    if (stored?.admin?.id) {
      dispatch(GetAuthenticationmodule(stored?.admin?.id));
    }
  }, [dispatch]);  
 useEffect(() => {
  if (user) {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      gender: user?.gender || '',
      role_id:user?.role_id || '',
    });
  }
},[user]);
  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file?.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await dispatch(AuthenticationUpdatemodule(formData)).unwrap();
      toast.success(res.message || 'Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-y-30 gap-x-0">
      <div className="col-span-12">
        <CardBox>
          <div className="mx-auto text-center mt-5">
            <img
              src={selectedImage}
              alt="profile"
              style={{ height: '120px', width: '120px' }}
              className="rounded-full mx-auto cursor-pointer"
              onClick={handleImageClick}
            />
            <TextInput
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <h5 className="card-title text-center py-3">User Profile Details</h5>

          <div className="grid grid-cols-12 gap-6">
            <div className="md:col-span-6 col-span-12">
              <Label value="User Name" />
              <TextInput
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="form-control"
              />

              <Label value="Email" />
              <TextInput
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="md:col-span-6 col-span-12">
              <Label value="Role" />
              <select
                value={formData.role_id}
                onChange={(e) => handleChange('role_id', e.target.value)}
                className="block w-full rounded-md border px-3 py-2"
              >
                <option value="" disabled>Select Role</option>
                {roleOptions.map(role => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>

              <Label value="Phone" />
              <TextInput
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-span-6">
              <Label value="Address" />
              <TextInput
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-span-6">
              <Label value="Gender" />
              <Select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5">
            <Button color="primary" onClick={handleSubmit}>Save</Button>
            <Button color="gray">Cancel</Button>
          </div>
        </CardBox>
      </div>
    </div>
  );
};

export default UserProfile;
