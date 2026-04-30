import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Consultation = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const consultationData = {
      ...data,
      userId: user?._id || user?.uid,
      userName: user?.displayName,
      userEmail: user?.email,
      userPhone: user?.phone || null,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post('/consultations', consultationData);
      if (res.data.insertedId) {
        alert('Consultation request submitted successfully!');
        reset();
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Failed to submit consultation request. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#062416]">
        Request a Consultation
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card bg-base-100 shadow-xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              defaultValue={user?.displayName || ''}
              {...register('fullName', { required: 'Full name is required' })}
              className="input input-bordered w-full"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="Your email"
              defaultValue={user?.email || ''}
              {...register('email', { required: 'Email is required' })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="Your phone number"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: 'Enter a valid Bangladeshi phone number (e.g., 01712345678)',
                },
              })}
              className="input input-bordered w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Preferred Date</span>
            </label>
            <input
              type="date"
              {...register('preferredDate', { required: 'Preferred date is required' })}
              min={new Date().toISOString().split('T')[0]}
              className="input input-bordered w-full"
            />
            {errors.preferredDate && (
              <p className="text-red-500 text-sm mt-1">{errors.preferredDate.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Preferred Time</span>
            </label>
            <select
              {...register('preferredTime', { required: 'Preferred time is required' })}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select a time slot
              </option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
              <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
              <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
            </select>
            {errors.preferredTime && (
              <p className="text-red-500 text-sm mt-1">{errors.preferredTime.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Consultation Type</span>
            </label>
            <select
              {...register('consultationType', { required: 'Type is required' })}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Concert Event">Concert Event</option>
              <option value="Industrial Conferences">Industrial Conferences</option>
              <option value="Birth Ceremony">Birth Ceremony</option>
              <option value="Photo Booth">Photo Booth</option>
              <option value="Seminars">Seminars</option>
            </select>
            {errors.consultationType && (
              <p className="text-red-500 text-sm mt-1">{errors.consultationType.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Additional Notes / Concerns</span>
            </label>
            <textarea
              placeholder="Describe your concerns or questions..."
              {...register('notes')}
              className="textarea textarea-bordered w-full h-32"
            ></textarea>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="btn bg-yellow-500 text-white hover:bg-[#0a3a25] px-8"
          >
            Submit Consultation Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default Consultation;