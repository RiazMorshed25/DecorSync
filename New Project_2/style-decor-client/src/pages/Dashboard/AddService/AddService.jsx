import { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddService = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceIdArray, setServiceIdArray] = useState(['']); 
  const [description, setDescription] = useState('');
  const [costArray, setCostArray] = useState(['']);
  const [category, setCategory] = useState('');
  const [imagesArray, setImagesArray] = useState(['']); 

  const categories = [
    'Wedding Ceremony',
    'Concert Event',
    'Birth Ceremony',
    'Photo Booth',
    'Industrial Conferences',
    'Seminars',
    'Corporate Events',
    'Birthday Party',
    'Anniversary Decoration',
    'Festival Decoration',
    'Baby Shower',
    'Other'
  ];

  const handleArrayChange = (index, value, arraySetter, array) => {
    const newArray = [...array];
    newArray[index] = value;
    arraySetter(newArray);
  };

  const addArrayItem = (arraySetter, array) => {
    arraySetter([...array, '']);
  };

  const removeArrayItem = (index, arraySetter, array) => {
    const newArray = array.filter((_, i) => i !== index);
    arraySetter(newArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newService = {
      serviceTitle,
      serviceId: serviceIdArray.filter(id => id.trim() !== ''), 
      description,
      cost: costArray.filter(cost => cost.trim() !== '').map(Number), 
      category,
      images: imagesArray.filter(img => img.trim() !== ''),
      createdAt: new Date(),
    };

    if (!serviceTitle || !description || !category || newService.serviceId.length === 0 || newService.cost.length === 0 || newService.images.length === 0) {
      Swal.fire('Error', 'Please fill all required fields and at least one item in each array.', 'error');
      return;
    }

    try {
      const res = await axiosSecure.post('/services', newService);
      if (res.data.insertedId) {
        Swal.fire('Success', 'Service added successfully!', 'success');
        navigate('/services'); 
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'Failed to add service', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Decoration Service</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
          <input
            type="text"
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
            className="input input-bordered w-full"
            placeholder="e.g., Royal Wedding Package"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service IDs (Multiple)</label>
          {serviceIdArray.map((id, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={id}
                onChange={(e) => handleArrayChange(index, e.target.value, setServiceIdArray, serviceIdArray)}
                className="input input-bordered flex-1"
                placeholder="e.g., SVC001"
              />
              {serviceIdArray.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, setServiceIdArray, serviceIdArray)}
                  className="btn bg-yellow-400 btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setServiceIdArray, serviceIdArray)}
            className="btn bg-yellow-400 btn-sm mt-2"
          >
            + Add Another ID
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full h-32"
            placeholder="Describe the service in detail..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Costs (Multiple, in BDT)</label>
          {costArray.map((cost, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="number"
                value={cost}
                onChange={(e) => handleArrayChange(index, e.target.value, setCostArray, costArray)}
                className="input input-bordered flex-1"
                placeholder="e.g., 15000"
              />
              {costArray.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, setCostArray, costArray)}
                  className="btn bg-yellow-400 btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setCostArray, costArray)}
            className="btn bg-yellow-400 btn-sm mt-2"
          >
            + Add Another Cost
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (Multiple)</label>
          {imagesArray.map((img, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                value={img}
                onChange={(e) => handleArrayChange(index, e.target.value, setImagesArray, imagesArray)}
                className="input input-bordered flex-1"
                placeholder="e.g., https://example.com/image1.jpg"
              />
              {imagesArray.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, setImagesArray, imagesArray)}
                  className="btn bg-yellow-400 btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setImagesArray, imagesArray)}
            className="btn bg-yellow-400 btn-sm mt-2"
          >
            + Add Another Image URL
          </button>
        </div>

        <div className="text-center">
          <button type="submit" className="btn bg-green-700 btn-lg w-full md:w-auto">
            Add Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;