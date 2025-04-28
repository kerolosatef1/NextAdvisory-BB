import { useState, useEffect, Fragment } from "react";
import axios from "axios";

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get("/api/ClassRooms");
        setHalls(response.data);
        setFilteredHalls(response.data);
      } catch (err) {
        setError("❌Error on API Requests");
      }
      setLoading(false);
    };

    fetchHalls();
  }, []);

  useEffect(() => {
    const filtered = halls.filter((prof) =>
      prof.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredHalls(filtered);
  }, [search, halls]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://timetableapi.runasp.net/api/ClassRooms/${id}`);
      setFilteredHalls((prevHalls) =>
        prevHalls.filter((hall) => hall.id !== id)
      );
    } catch (err) {
      setError("❌ حدث خطأ أثناء محاولة حذف الأستاذ.");
    }
  };

  return (
   
   <div className="background-main-pages p-11">
    <div className="max-w-screen-xl mx-auto rounded-md bg-slate-800 px-4 sm:px-6 ">

    <Fragment>
      <div className="text-center">
      <input
        type="text"
        placeHolder="🔍 ابحث عن أستاذ بالاسم..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=" mt-5  w-3/5 p-2 border rounded mb-4"
      /></div>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden ">
              <table className="min-w-full divide-y  divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium  text-white uppercase dark:text-neutral-500"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      Hall type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      Hall Capacity
                    </th>
                    <th
                      scope="col" 
                      className="px-6 py-3 text-end text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      Action
                    </th>
                    <th
                      scope="col" 
                      className="px-6 py-3 text-end text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {loading && (
                    <tr>
                    <td colSpan="5" className="text-center py-4">
                        ⏳ جاري التحميل...
                    </td>
                    </tr>
                )}
                {error && (
                    <tr>
                    <td colSpan="5" className="text-center py-4 text-red-500">
                        {error}
                    </td>
                    </tr>
                    )}
                    {!loading &&
                    !error &&
                    (filteredHalls.length > 0 ? (
                        filteredHalls.map((hall) => (
                        <tr
                            key={hall.id}
                            className="hover:bg-black dark:hover:bg-neutral-700"
                        >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-red-500">
                            {hall.name}
                            </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">
                            {hall.id}
                            </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">
                            {hall.type ? 'Lab' : 'Lecture'}
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">
                            {hall.capacity}
                            
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent text-blue-500  hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                            >
                              Edit
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                                type="button"
                                className="inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent text-red-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                                onClick={() => handleDelete(hall.id)}
                            >
                              Delete
                            </button>
                          </td>
                          
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-white">
                          
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
    </div>
    </div>
  );
};

export default Halls;
