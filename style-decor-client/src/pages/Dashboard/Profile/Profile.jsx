import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading";

const Profile = () => {
  const { user: authUser, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: user = {},
    isLoading,
  } = useQuery({
    queryKey: ["user", authUser?.email],
    enabled: !!authUser?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${authUser.email}`
      );
      return res.data?.[0];
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (!authUser) {
    return (
      <div className="text-center mt-10 text-red-500">
        Please login to view your profile
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-30 bg-gradient-to-r from-green-500 to-yellow-300"></div>

      <div className="flex items-center justify-between px-6 -mt-12">
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || authUser.photoURL}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {user.displayName || authUser.displayName}
            </h2>
            <p className="text-gray-500">
              {user.email || authUser.email}
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-yellow-300 text-black rounded-md">
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-2">
        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            type="text"
            value={user.displayName || ""}
            readOnly
            className="w-full mt-1 p-2 bg-gray-100 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Role</label>
          <input
            type="text"
            value={user.role || 'user'}
            readOnly
            className="w-full mt-1 p-2 bg-gray-100 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Gender</label>
          <select className="w-full mt-1 p-2 bg-gray-100 rounded-md">
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-500">Country</label>
          <select className="w-full mt-1 p-2 bg-gray-100 rounded-md">
            <option>Bangladesh</option>
            <option>India</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-500">Language</label>
          <select className="w-full mt-1 p-2 bg-gray-100 rounded-md">
            <option>English</option>
            <option>Bangla</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-500">Time Zone</label>
          <select className="w-full mt-1 p-2 bg-gray-100 rounded-md">
            <option>GMT +6</option>
          </select>
        </div>
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-sm font-semibold mb-2">My email Address</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {user.email || authUser.email}
        </div>

        <button className="mt-3 text-blue-500 text-sm">
          + Add Email Address
        </button>
      </div>
    </div>
  );
};

export default Profile;
