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
  Spinner
}from "@material-tailwind/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';

const ProfessorCoursesManager = ({ professorId, 
  manageOpen, 
  setManageOpen ,  selectedProfessor }) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const queryClient = useQueryClient();

  // جلب جميع المواد
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get("https://timetableapi.runasp.net/api/Courses", {
        headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json" }
      });
      return data;
    }
  });

  const { data: courseProfessors = [], isLoading: assignedLoading } = useQuery({
    queryKey: ['courseProfessors'],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(
        "https://timetableapi.runasp.net/api/CourseProfessors",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          } 
        }
      );
      return data;
    }
  });
  const professorCourses = courseProfessors.filter(
    cp => cp.idProfessor === professorId
  );
  // إضافة مادة
  const assignMutation = useMutation({
    mutationFn: (courseId) => axios.post(
      `https://timetableapi.runasp.net/api/CourseProfessors/${professorId}/${courseId}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}`,"Content-Type": "application/json" } }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries(['courseProfessors']);
      setSelectedCourse("");
    }
  });

  // حذف مادة
  const unassignMutation = useMutation({
    mutationFn: (courseId) => axios.delete(
      `https://timetableapi.runasp.net/api/CourseProfessors/${professorId}/${courseId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}`,"Content-Type": "application/json" } }
    ),
    onSuccess: () => queryClient.invalidateQueries(['courseProfessors'])
  });
  
  return (
    <div className="p-4 mt-4 bg-gray-100 rounded-lg">
     <Dialog
  size="xl"
  open={manageOpen}
  handler={setManageOpen}
  className="p-4 rounded-xl shadow-xl"
>
  <DialogHeader className="relative m-0 block bg-blue-800 text-white p-4 rounded-t-xl">
    <Typography variant="h4" className="text-white">
      إدارة المواد الدراسية{selectedProfessor?.name}
    </Typography>
    <IconButton
      size="sm"
      variant="text"
      className="!absolute right-3.5 top-3.5 text-white"
      onClick={() => setManageOpen(false)}
      color="green"
    >
      <XMarkIcon className="h-5 w-5 " />
    </IconButton>
  </DialogHeader>

  <DialogBody className="space-y-4 pb-6 pt-6 overflow-y-auto max-h-[60vh]">
    <div>
      
        <Select
        label="اختر المادة"
        value={selectedCourse}
        onChange={(value) => setSelectedCourse(value)}
      >
        <Option value="" disabled>اختر المادة</Option>
        {courses.map(course => (
          <Option key={course.id} value={course.id}>
            {course.name}
          </Option>
        ))}
      </Select>

    </div>

    <div className="space-y-2">
        {professorCourses?.map(cp => (
          <div key={cp.idCourse} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>{cp.nameCourse}</span>
            <Button
              variant="text"
              color="red"
              onClick={() => unassignMutation.mutate(cp.idCourse)}
              disabled={unassignMutation.isLoading}
            >
              {unassignMutation.isLoading ? <Spinner /> : 'حذف'}
            </Button>
          </div>
        ))}
      </div>
  </DialogBody>

  <DialogFooter className="px-4 pb-4">
  <Button
        fullWidth
        onClick={() => assignMutation.mutate(selectedCourse)}
        disabled={!selectedCourse || assignMutation.isLoading}
      >
        {assignMutation.isLoading ? <Spinner /> : 'ربط المادة'}
      </Button>
  </DialogFooter>
</Dialog>
    </div>
  );
};



const GetProfessors = () => {
  const [editProfessor, setEditProfessor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  
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
    setProfessor(prev => ({ ...prev, [name]: value }));
  };

  const { data: courseProfessors = [] } = useQuery({
    queryKey: ['courseProfessors'],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(
        "https://timetableapi.runasp.net/api/CourseProfessors",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          } 
        }
      );
      return data;
    }
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfessor(prev => ({
      ...prev,
      availability: checked
        ? [...prev.availability, name]
        : prev.availability.filter(day => day !== name)
    }));
  };
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("userToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
      
      const url = isEdit 
        ? `https://timetableapi.runasp.net/api/Professors/${payload.id}`
        : `https://timetableapi.runasp.net/api/Professors`;
      
      const method = isEdit ? axios.put : axios.post;
      const { data } = await method(url, payload, { headers });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['professors']);
      toast.success("✅ تم الحفظ بنجاح");
      handleOpen();
      resetForm();
    },
    onError: (error) => {
      toast.error(`❌ خطأ: ${error.response?.data?.message || error.message}`);
    }
  });
  

  
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [search, setSearch] = useState("");
  
  const [open, setOpen] = React.useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const { 
    data: professors = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['professors'],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(
        "https://timetableapi.runasp.net/api/Professors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return data;
    }
  });

  useEffect(() => {
    const filtered = professors.filter((prof) =>
      prof.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProfessors(filtered);
  }, [search, professors]);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `https://timetableapi.runasp.net/api/Professors/${id}`,
        { headers: { Authorization: `Bearer ${token}` ,"Content-Type": "application/json"} }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['professors']);
      toast.success(" Delete Successfully");
    },
    onError: (error) => {
      toast.error(`❌ خطأ في الحذف: ${error.response?.data?.message}`);
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const daysObject = Object.keys(dayMap).reduce((acc, day) => {
      acc[dayMap[day]] = professor.availability.includes(day);
      return acc;
    }, {});
    const payload = {
      id: parseInt(professor.id, 10),
      name: professor.name.trim(),
      numberAssignedCourses: 1,
      ...daysObject
    };
    
    if (isEdit) {
      payload.id = parseInt(professor.id, 10);
    }
  
    mutation.mutate(payload);
    if (!professor.name.trim()) {
      toast.error('يرجى إدخال اسم البروفيسور');
      return;
    }

  };
  const handleDelete = (id) => {
    if (window.confirm("Are You Sure About Delete")) {
      deleteMutation.mutate(id);
    }
  };
  const resetForm = () => {
    setProfessor({ id: "", name: "", availability: [] });
    setIsEdit(false);
    setEditProfessor(null);
  };
  const handleOpen = (professorToEdit = null) => {
    if (professorToEdit?.id) {
      const postData = {
        id: professorToEdit.id,
        name: professorToEdit.name,
        availability: Object.keys(dayMap)
          .filter(day => professorToEdit[dayMap[day]])
          .map(day => dayMap[day])
      };
      
      console.log("PUT Data:", JSON.stringify(postData, null, 2));
      
  
      setProfessor({
        id: professorToEdit.id.toString() || "",
        name: professorToEdit.name  || "",
        availability: Object.keys(dayMap).filter(day => professorToEdit[dayMap[day]])
      });
      setIsEdit(true);
 
    }else {
    // تحضير بيانات POST للإضافة
    console.log("POST Data template:", JSON.stringify({
      name: "",
      availability: []
    }, null, 2));
    
    resetForm();
  }
    setOpen(!open);
  };
 

  return <>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
   
   <div className="background-main-pages p-11">
    <div className="max-w-screen-xl mx-auto rounded-md bg-slate-800 px-4 sm:px-6 ">
  
    <div className="flex justify-end  ">
  <Button onClick={() => handleOpen()} variant="gradient" className="bg-blue-700">
  {isEdit ?"Modify Proffesors": "Add Proffesor"}
  </Button>
</div>
<Dialog 
  size="sm" 
  open={open} 
  handler={handleOpen} 
  className="p-4 rounded-xl shadow-xl"
>
  <DialogHeader className="relative m-0 block bg-blue-800 text-white p-4 rounded-t-xl">
    <Typography variant="h4" className="text-white">
      {isEdit ? "تعديل الأستاذ" : "إضافة أستاذ جديد"}
    </Typography>
    <IconButton
      size="sm"
      variant="text"
      className="!absolute right-3.5 top-3.5 text-white"
      onClick={handleOpen}
    >
      <XMarkIcon className="h-5 w-5 stroke-2" />
    </IconButton>
  </DialogHeader>

  <DialogBody className="space-y-4 pb-6 pt-6">
    <div>
      <Typography variant="small" className="mb-2 text-gray-700 font-medium">
        اسم الأستاذ
      </Typography>
      <Input
        size="lg"
        placeholder="مثال: د. أحمد محمود"
        className="!border-[1.5px] !border-gray-200 focus:!border-blue-800"
        value={professor.name}
        onChange={handleChange}
        name="name"
      />
    </div>

    <div>
      <Typography variant="small" className="mb-2 text-gray-700 font-medium">
        الأيام المتاحة
      </Typography>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(dayMap).map((day) => (
          <label key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-800"
              checked={professor.availability.includes(day)}
              onChange={handleCheckboxChange}
              name={day}
            />
            <span className="text-gray-700">{day}</span>
          </label>
        ))}
      </div>
    </div>
  </DialogBody>

  <DialogFooter className="px-4 pb-4">
    <Button 
      className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg"
      onClick={handleSubmit}
    >
      {isEdit ? "حفظ التعديلات" : "إضافة أستاذ"}
    </Button>
  </DialogFooter>
</Dialog>
    <Fragment>
      <div className="text-center">
      <input
        type="text"
        placeholder="🔍 ابحث عن أستاذ بالاسم..."
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
                      المواد اللي بيديها الدكتور
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                      Assigned Courses
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase dark:text-neutral-500"
                    >
                     Action 
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
                {isLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-white">
                          جاري التحميل...
                        </td>
                      </tr>
                  ):
                  isError ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-red-500">
                        {error.message}
                      </td>
                    </tr>
                  ):
                  
                  filteredProfessors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-white">
                        لا توجد نتائج
                      </td>
                    </tr> ) : (
                      filteredProfessors.map((professor) => (
                        <Fragment key={professor.id}>
                        <tr
                          key={professor.id}
                          className="hover:bg-black dark:hover:bg-neutral-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-red-500">
                            {professor.name}
                          </td>
                        
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">

                                {Object.entries(dayMap)
                                    .filter(([_, key]) => professor[key])
                                        .map(([day]) => day)
                                        .join(", ") || "غير متاح"}
                          </td>
                          
                                  




<td className="px-6 py-4 whitespace-nowrap text-sm text-white">
  <div className="flex flex-wrap gap-2">
    {courseProfessors
      .filter(cp => cp.idProfessor === professor.id)
      .map(cp => (
        <span 
          key={cp.idCourse}
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          {cp.nameCourse}
        </span>
      ))}
  </div>
</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-red-500">
                            📚 عدد المواد المسندة:{" "}
                            {professor.numberAssignedCourses}
                          </td>
                          
                          
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
  <Button
    onClick={() => {
      setSelectedProfessor(professor);
      setManageOpen(true);
    }}
    variant="gradient"
    size="sm"
    className="btn-management w-full"
  >
    إدارة المواد
  </Button>
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
                              className="inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-700 focus:outline-hidden focus:text-red-700 disabled:opacity-50 disabled:pointer-events-none dark:text-red-600  dark:focus:text-red-500"
                              onClick={() => handleDelete(professor.id)}
                              >
                              Delete
                            </button>
                          </td>
                          
                        </tr>
                      </Fragment>
                        
                        ))
                    )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
    {/* بعد نهاية الجدول الرئيسي */}
<Dialog
  open={manageOpen}
  handler={setManageOpen}
  size="md"
  className="fixed left-0 top-0 h-full w-96 rounded-r-xl shadow-xl"
>
  <DialogHeader className="bg-blue-800 text-white p-4">
    <Typography variant="h5">
      إدارة المواد الدراسية
    </Typography>
    <IconButton
      color="white"
      size="sm"
      className="!absolute right-2 top-2"
      onClick={() => setManageOpen(false)}
    >
      <XMarkIcon className="h-5 w-5" />
    </IconButton>
  </DialogHeader>
  
 <DialogBody className="p-96 ">
    {selectedProfessor && (
      <ProfessorCoursesManager 
        professorId={selectedProfessor.id}
        manageOpen={manageOpen}
        setManageOpen={setManageOpen}
        selectedProfessor={selectedProfessor} // تمرير المتغير هنا
      />
    )}
  </DialogBody>
</Dialog>
    </div>
   
    </div>
    
    </>
};

export default GetProfessors;

