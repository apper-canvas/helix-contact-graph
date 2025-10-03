import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
...contactData,
      Id: Math.max(...contacts.map(c => c.Id)) + 1,
      emailStatus: contactData.emailStatus || "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      emailStatus: contactData.emailStatus || contacts[index].emailStatus || "New",
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    
    // Send email notification via Edge function
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_SEND_CONTACT_UPDATE_EMAIL,
        {
          body: JSON.stringify({
            contactId: updatedContact.Id,
            firstName: updatedContact.firstName,
            lastName: updatedContact.lastName,
            email: updatedContact.email,
            company: updatedContact.company,
            position: updatedContact.position
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (result && !result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_CONTACT_UPDATE_EMAIL}. The response body is: ${JSON.stringify(result)}.`);
      }
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_CONTACT_UPDATE_EMAIL}. The error is: ${error.message}`);
    }
    
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const deletedContact = { ...contacts[index] };
    contacts.splice(index, 1);
    return deletedContact;
  }
};