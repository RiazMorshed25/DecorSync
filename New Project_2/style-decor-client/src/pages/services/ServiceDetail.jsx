import { Link, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const ServiceDetail = () => {
  const { user } = useAuth();
  const { _id } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: service,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["service", _id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services/${_id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }
  if (!service) {
    return (
      <div className="text-center text-lg font-medium p-6">
        Service not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-[#062416]">
        {service.serviceTitle}
      </h1>

      <p className="text-gray-700 text-justify mx-auto mb-10 leading-relaxed">
        {service.description}
      </p>

      {/* Single Card with One Image */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition max-w-4xl mx-auto">
        <img
          src={service.images}
          alt={service.serviceTitle}
          className="w-full h-96 object-cover"
        />

        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500">Starting From</p>
            <p className="text-3xl font-bold text-[#062416]">
              BDT {service.cost}
            </p>
          </div>

          <Link
            to="/booking"
            state={{
              serviceTitle: service.serviceTitle,
              serviceId: _id,
              cost: service.cost,
              image: service.images,
            }}
          >
            <button className="bg-yellow-500 hover:bg-[#062416] text-white font-medium px-8 py-3 rounded-lg transition">
              Booking Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;