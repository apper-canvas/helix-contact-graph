import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

// Transform database field names to UI-friendly names
const transformFromDB = (record) => ({
  Id: record.Id,
  firstName: record.First_Name_c || "",
  lastName: record.Last_Name_c || "",
  email: record.Email_c || "",
  phone: record.Phone_c || "",
  company: record.Company_c || "",
  position: record.Position_c || "",
  photo: record.Photo_c || "",
  tags: record.Tags_c ? record.Tags_c.split(",").map(t => t.trim()) : [],
  notes: record.Notes_c || "",
  emailStatus: record.Email_Status_c || "New",
  createdAt: record.createdAt,
  updatedAt: record.updatedAt
});

// Transform UI field names to database field names
const transformToDB = (data) => {
  const dbData = {};
  if (data.firstName !== undefined) dbData.First_Name_c = data.firstName;
  if (data.lastName !== undefined) dbData.Last_Name_c = data.lastName;
  if (data.email !== undefined) dbData.Email_c = data.email;
  if (data.phone !== undefined) dbData.Phone_c = data.phone;
  if (data.company !== undefined) dbData.Company_c = data.company;
  if (data.position !== undefined) dbData.Position_c = data.position;
  if (data.photo !== undefined) dbData.Photo_c = data.photo;
  if (data.tags !== undefined) dbData.Tags_c = Array.isArray(data.tags) ? data.tags.join(",") : data.tags;
  if (data.notes !== undefined) dbData.Notes_c = data.notes;
  if (data.emailStatus !== undefined) dbData.Email_Status_c = data.emailStatus;
  return dbData;
};

export const contactService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "First_Name_c"}},
          {"field": {"Name": "Last_Name_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "Company_c"}},
          {"field": {"Name": "Position_c"}},
          {"field": {"Name": "Photo_c"}},
          {"field": {"Name": "Tags_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "Email_Status_c"}},
          {"field": {"Name": "createdAt"}},
          {"field": {"Name": "updatedAt"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("contact_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformFromDB);
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      toast.error("Failed to fetch contacts");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "First_Name_c"}},
          {"field": {"Name": "Last_Name_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "Company_c"}},
          {"field": {"Name": "Position_c"}},
          {"field": {"Name": "Photo_c"}},
          {"field": {"Name": "Tags_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "Email_Status_c"}},
          {"field": {"Name": "createdAt"}},
          {"field": {"Name": "updatedAt"}}
        ]
      };

      const response = await apperClient.getRecordById("contact_c", parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Contact not found");
      }

      if (!response.data) {
        throw new Error("Contact not found");
      }

      return transformFromDB(response.data);
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDB(contactData);

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord("contact_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create contact");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create contact");
        }

        if (successful.length > 0) {
          return transformFromDB(successful[0].data);
        }
      }

      throw new Error("Failed to create contact");
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDB(contactData);
      dbData.Id = parseInt(id);

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord("contact_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update contact");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update contact");
        }

        if (successful.length > 0) {
          const updatedContact = transformFromDB(successful[0].data);

          // Send email notification via Edge function
          try {
            const emailResult = await apperClient.functions.invoke(
              import.meta.env.VITE_SEND_CONTACT_UPDATE_EMAIL,
              {
                body: JSON.stringify({
                  contactId: updatedContact.Id,
                  First_Name_c: updatedContact.firstName,
                  Last_Name_c: updatedContact.lastName,
                  Email_c: updatedContact.email,
                  Company_c: updatedContact.company,
                  Position_c: updatedContact.position
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            if (emailResult && !emailResult.success) {
              console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_CONTACT_UPDATE_EMAIL}. The response body is: ${JSON.stringify(emailResult)}.`);
            }
          } catch (emailError) {
            console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_CONTACT_UPDATE_EMAIL}. The error is: ${emailError.message}`);
          }

          return updatedContact;
        }
      }

      throw new Error("Failed to update contact");
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("contact_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to delete contact");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete contact");
        }

        return successful.length > 0;
      }

      throw new Error("Failed to delete contact");
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
throw error;
    }
  }
};