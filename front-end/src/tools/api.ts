import axios from "axios";

export const post = async (url: string, data: any, config = {}) => {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const get = async (url: string, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const put = async (url: string, data: any, config = {}) => {
  try {
    const response = await axios.put(url, data, config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const patch = async (url: string, data: any, config = {}) => {
  try {
    const response = await axios.patch(url, data, config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const remove = async (url: string, config = {}) => {
  try {
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
