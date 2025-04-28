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
import * as Yup from 'yup'

export default function Postprofessor({ open, handleOpen ,  isEdit = false, editProfessor = null}){

  
const queryClient = useQueryClient();
const [professor, setProfessor] = useState({ id: "", name: "", availability: [] });
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (isEdit && editProfessor) {
    const selectedDays = Object.keys(dayMap).filter(
      (day) => editProfessor[dayMap[day]] === true
    );
    setProfessor({
      id: editProfessor.id.toString(),
      name: editProfessor.name,
      availability: selectedDays
    });
  }
}, [isEdit, editProfessor]);




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
      Object.values(dayMap).forEach((short) => {
        daysObject[short] = professor.availability.includes(
          Object.keys(dayMap).find((k) => dayMap[k] === short)
        );
      });

      const professorData = {
        id: parseInt(professor.id, 10),
        name: professor.name.trim(),
        numberAssignedCourses: 1,
        ...daysObject,
      };

      const url = `http://timetableapi.runasp.net/api/Professors/${professorData.id}`;
    const method = isEdit ? "put" : "post";

    await axios[method](url, professorData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });

    queryClient.invalidateQueries(["professors"]);
    setMessage("✅Saving Data ");
    setProfessor({ id: "", name: "", availability: [] });
    handleOpen();
  } catch (error) {
    setMessage(`❌ ${error.response?.data?.message || "حدث خطأ ما"}`);
  }

  setLoading(false);
};

    
    
    return <>
   <div className="flex justify-end  ">
     
   </div>
   <Dialog open={open} handler={handleOpen} size="lg" className="p-4 max-h-[80vh] overflow-y-auto">
      <DialogHeader className="relative">
        <Typography variant="h4">إضافة دكتور</Typography>
        <IconButton onClick={handleOpen} className="absolute bg-white right-4 top-4">
          <XMarkIcon className=" bg-red-500" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 bg-blue-400">
        <Input placeholder="Name Professors" name="name" value={professor.name} onChange={handleChange} />
        <div>
          <label className="block mb-1 font-semibold">Available days</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(dayMap).map((day) => (
              <label key={day} className="flex items-center gap-2">
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
        {message && <p className="text-sm text-red-500">{message}</p>}
      </DialogBody>
      <DialogFooter className="bg-fuchsia-500">
        <Button className="text-black" onClick={handleSubmit} loading={loading}>
          Submmit
        </Button>
      </DialogFooter>
    </Dialog>  </>
}