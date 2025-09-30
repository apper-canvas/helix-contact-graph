import React, { useState } from "react";
import { motion } from "framer-motion";
import ContactList from "@/components/organisms/ContactList";
import ContactDetail from "@/components/organisms/ContactDetail";
import ContactModal from "@/components/organisms/ContactModal";
import DeleteContactModal from "@/components/organisms/DeleteContactModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ContactsPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowMobileDetail(true);
  };

  const handleEditContact = (contact) => {
    setContactToEdit(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleSaveContact = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleContactDeleted = (deletedContact) => {
    if (selectedContact?.Id === deletedContact.Id) {
      setSelectedContact(null);
      setShowMobileDetail(false);
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setContactToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const handleCloseMobileDetail = () => {
    setShowMobileDetail(false);
    setSelectedContact(null);
  };

return (
    <div className="h-screen bg-green-50 overflow-hidden">
      {/* Main Content */}
      <div className="h-full flex">
        {/* Left Sidebar Navigation */}
        <div className="w-80 border-r border-green-200 bg-white shadow-sm">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Contact Hub
                  </h1>
                  <p className="text-sm text-slate-600">Manage your contacts</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Navigation
                </div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  All Contacts
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Star" className="w-4 h-4" />
                  Favorites
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Building" className="w-4 h-4" />
                  Companies
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Tags" className="w-4 h-4" />
                  Tags
                </button>
              </div>
              
              <div className="pt-4 border-t border-green-200">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </div>
                <Button
                  onClick={() => handleEditContact(null)}
                  icon="Plus"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl justify-start"
                >
                  Add New Contact
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Right Content Area - Contact Cards */}
        <div className="flex-1 bg-white">
          <ContactList
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseModal}
        contact={contactToEdit}
        onSave={handleSaveContact}
        isEdit={!!contactToEdit}
      />

      <DeleteContactModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        contact={contactToDelete}
        onDelete={handleContactDeleted}
      />
    </div>
  );
};

export default ContactsPage;