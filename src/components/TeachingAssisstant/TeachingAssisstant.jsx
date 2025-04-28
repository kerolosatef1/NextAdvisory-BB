import { useState, useEffect, Fragment } from "react";
import React from "react";
import axios from "axios";
import {
  Input,
  Option,
  Select,
  Button,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  ThemeProvider,
}from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";



const GetProfessors = () => {
  const [editProfessor, setEditProfessor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();
  
  const [message, setMessage] = useState("");
  
  const [professor, setProfessor] = useState({
    id: "",
    name: "",
    availability: [] 
  });
  const dayMap = {
    Saturday: "sat",
    Sunday: "sun",
    Monday: "mon",
    Tuesday: "tue",
    Wednesday: "wed",
    Thursday: "thu",
    Friday: "fri"
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id" && !/^\d*$/.test(value)) return;
    setProfessor({ ...professor, [name]: value });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfessor((prev) => {
      const updatedAvailability = checked
        ? [...prev.availability, name]
        : prev.availability.filter((day) => day !== name);
      return { ...prev, availability: updatedAvailability };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
  
    try {
      const daysObject = {}; 
      Object.entries(dayMap).forEach(([fullDay, short]) => { 
        daysObject[short] = professor.availability.includes(fullDay); 
      });
  
      const professorData = {
        id: parseInt(professor.id, 10),
        name: professor.name.trim(),
        numberAssignedCourses: 1,
        ...daysObject
      };
  
      const token = localStorage.getItem("userToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
  
      let response;
      if (isEdit) {
        response = await axios.put(
          `https://timetableapi.runasp.net/api/TeachingAssistants/${professor.id}`,
          professorData,
          { headers }
        );
      } else {
        response = await axios.post(
          "https://timetableapi.runasp.net/api/TeachingAssistants",
          professorData,
          { headers }
        );
      }
  
      console.log("✅ API Response:", response.data);
      queryClient.invalidateQueries(["professors"]);
      setMessage("✅ تم الحفظ بنجاح!");
      setProfessor({ id: "", name: "", availability: [] });
      setIsEdit(false);
      setEditProfessor(null);
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error);
      setMessage(`❌ حدث خطأ: ${error.response?.data?.message || "تفاصيل غير متوفرة"}`);
    }
  
    setLoading(false);
  };
  

  const [professors, setProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = (professorToEdit = null) => {
    if (professorToEdit) {
      setProfessor({
        id: professorToEdit.id.toString(),
        name: professorToEdit.name,
        availability: Object.keys(dayMap).filter((day) => professorToEdit[dayMap[day]]),
      });
      setIsEdit(true);
      setEditProfessor(professorToEdit);
    } else {
      setProfessor({ id: "", name: "", availability: [] });
      setIsEdit(false);
      setEditProfessor(null);
    }
    setOpen(!open);
  };

  useEffect(() => {
    const fetchProfessors = async () => {
      const token = localStorage.getItem("userToken");
    
      if (!token) {
        setError("❌token is problem");
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.get("https://timetableapi.runasp.net/api/TeachingAssistants", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    
        setProfessors(response.data);
        setFilteredProfessors(response.data);
      } catch (err) {
        console.error("❌ API Error:", err.response?.data || err);
        setError("❌ حدث خطأ أثناء جلب بيانات الدكاترة.");
      }
    
      setLoading(false);
    };
    fetchProfessors();
  }, []);

  useEffect(() => {
    const filtered = professors.filter((prof) =>
      prof.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProfessors(filtered);
  }, [search, professors]);
  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
  
    if (!token) {
      setError("❌token");
      return;
    }
  
    try {
      await axios.delete(`https://timetableapi.runasp.net/api/TeachingAssistants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      
      setFilteredProfessors((prevProfessors) =>
        prevProfessors.filter((professor) => professor.id !== id)
      );
      setProfessors((prevProfessors) =>
        prevProfessors.filter((professor) => professor.id !== id)
      );
    } catch (err) {
      console.error("❌ Delete Error:", err.response?.data || err);
      setError("❌error on delete proffessors");
    }
  };
 

  return <>
    
   
   <div className="background-main-pages p-11">
    <div className="max-w-screen-xl mx-auto rounded-md bg-slate-800 px-4 sm:px-6 ">
    <div className="flex justify-end  ">
  <Button onClick={() => handleOpen()} variant="gradient" className="bg-blue-700">
    Add Proffesors
  </Button>
</div>
      <Dialog size="lg" open={open} handler={handleOpen} className="p-4 w-3/4 mx-auto mt-20 max-h-[80vh] overflow-y-auto rounded-xl shadow-lg bg-white  ">
        <DialogHeader className="relative m-0 block ">
          <Typography variant="h3" color="blue-gray">
            Enter Teaching Assistant
          </Typography>
          
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Name Professor
            </Typography>
            <Input
              color="gray"
              size="lg"
              placeholder="eg. White Shoes"
              name="name"
              value={professor.name}
              onChange={handleChange}
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          
          
          <div>
          <label className="block font-semibold">📆 الأيام المتاح فيها المعيد:</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(dayMap).map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={day}
                  checked={professor.availability.includes(day)}
                  onChange={handleCheckboxChange}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
          
          
        </DialogBody>
        <DialogFooter>
        <Button
  className="ml-auto text-black"
  onClick={(e) => {
    handleSubmit(e);
    handleOpen(); // إغلاق بعد الإرسال
  }}
>Submmit
  {isEdit ? "Update Professor" : "Add Professor"}
</Button>
        </DialogFooter>
      </Dialog>
    <Fragment>
      <div className="text-center">
      <input
        type="text"
        placeholder="🔍 ابحث عن أسم المعيد..."
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
                      Available Days
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      Assigned Courses
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
                    (filteredProfessors.length > 0 ? (
                      filteredProfessors.map((professor) => (
                        <tr
                          key={professor.id}
                          className="hover:bg-black dark:hover:bg-neutral-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-red-500">
                            {professor.name}
                          </td>
                        
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">
                              {" "}
                            {Object.keys(professor)
                              .filter(
                                (day) =>
                                  professor[day] === true &&
                                  day !== "id" &&
                                  day !== "name" &&
                                  day !== "numberAssignedCourses"
                              )
                              .join(", ") || "غير متاح"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">
                            📚 عدد المواد المسندة:{" "}
                            {professor.numberAssignedCourses}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleOpen(professor)}
                              className="inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent text-blue-500  hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                            >
                              Edit
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent text-red-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                              onClick={() => handleDelete(professor.id)}
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
    
    </>
};

export default GetProfessors;
