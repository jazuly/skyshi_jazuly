import { ElMessage } from "element-plus";

export const toastSuccess = (msg: string) => {
  return ElMessage({
    message: msg,
    type: "success",
  });
};

export const toastError = (msg: string) => {
  return ElMessage.error(msg);
};

export const priorityColor = (priority: string) => {
  switch (priority) {
    case "very-high":
      
      return "bg-red-500";
  
      case "high":
      
      return "bg-amber-500";
  
      case "normal":
      
      return "bg-lime-500";
  
      case "low":
      
      return "bg-cyan-500";
  
    default:
      return "bg-violet-500";
  }
}

export const sortString = (
  data: any,
  column: string,
  type: string
) => {
  return data.sort((a: any, b: any) => {
    let fa = a[column].toLowerCase(),
        fb = b[column].toLowerCase();

    if (type === 'asc') {
      if (fa < fb) {
        return 1;
      }
      
      if (fa > fb) {
        return -1;
      }
    } else {
      if (fa < fb) {
        return -1;
      }
  
      if (fa > fb) {
        return 1;
      }
    }

    return 0;
  });
}

export const sortDate = (
  data: any,
  column: string,
  type: string
) => {
  return data.sort((a: any, b: any) => {
    let fa = a[column],
        fb = b[column];

    if (type === 'asc') {
      if (new Date(fa) < new Date(fb)) {
        return 1;
      }
      
      if (new Date(fa) > new Date(fb)) {
        return -1;
      }
    } else {
      if (new Date(fa) < new Date(fb)) {
        return -1;
      }
  
      if (new Date(fa) > new Date(fb)) {
        return 1;
      }
    }

    return 0;
  });
}

export default {
  toastError,
  sortString,
  toastSuccess,
  priorityColor,
};