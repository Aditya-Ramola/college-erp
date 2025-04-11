import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getNotice,
} from "../../redux/actions/adminActions";
import Body from "./Body";
import AdminLayout from "./layouts/AdminLayout";

const AdminHome = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllStudent());
    dispatch(getAllFaculty());
    dispatch(getAllAdmin());
    dispatch(getAllDepartment());
    dispatch(getNotice());
  }, [dispatch]);
  
  return (
    <AdminLayout>
      <Body />
    </AdminLayout>
  );
};

export default AdminHome;
