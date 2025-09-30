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
    <div className="h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Contact Hub
            </h1>
          </div>
          
          <Button
            onClick={() => handleEditContact(null)}
            icon="Plus"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl"
          >
            <span className="hidden sm:inline">Add Contact</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Contact List - Desktop: always visible, Mobile: hidden when detail is shown */}
        <div className={`
          w-full lg:w-1/2 xl:w-2/5 border-r border-slate-200 bg-white
          ${showMobileDetail ? 'hidden lg:block' : 'block'}
        `}>
          <ContactList
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Contact Detail - Desktop: always visible, Mobile: overlay when contact selected */}
        <div className={`
          w-full lg:w-1/2 xl:w-3/5 bg-white
          ${!showMobileDetail ? 'hidden lg:block' : 'block'}
          ${showMobileDetail ? 'lg:relative absolute inset-0 z-30 lg:z-auto' : ''}
        `}>
          <motion.div
            key={selectedContact?.Id || 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <ContactDetail
              contact={selectedContact}
              onEdit={handleEditContact}
              onClose={handleCloseMobileDetail}
            />
          </motion.div>
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