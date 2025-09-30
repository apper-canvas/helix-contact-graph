import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import ContactCard from "@/components/molecules/ContactCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ContactList = ({ 
  selectedContact, 
  onSelectContact, 
  onEditContact, 
  onDeleteContact,
  onRefresh,
  refreshTrigger 
}) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [refreshTrigger]);

  const handleDeleteContact = async (contact) => {
    try {
      await contactService.delete(contact.Id);
      toast.success(`${contact.firstName} ${contact.lastName} deleted successfully`);
      await loadContacts();
      onDeleteContact(contact);
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact. Please try again.");
    }
  };

  const handleRefresh = () => {
    loadContacts();
    onRefresh?.();
  };

  const { filteredContacts, companies, tags } = useMemo(() => {
    let filtered = [...contacts];
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.phone.toLowerCase().includes(search) ||
        contact.company.toLowerCase().includes(search) ||
        (contact.position && contact.position.toLowerCase().includes(search)) ||
        (contact.tags && contact.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }
    
    // Company filter
    if (companyFilter) {
      filtered = filtered.filter(contact => contact.company === companyFilter);
    }
    
    // Tag filter
    if (tagFilter) {
      filtered = filtered.filter(contact => 
        contact.tags && contact.tags.includes(tagFilter)
      );
    }
    
    // Extract unique companies and tags
    const uniqueCompanies = [...new Set(contacts.map(contact => contact.company))].sort();
    const uniqueTags = [...new Set(contacts.flatMap(contact => contact.tags || []))].sort();
    
    return {
      filteredContacts: filtered,
      companies: uniqueCompanies,
      tags: uniqueTags
    };
  }, [contacts, searchTerm, companyFilter, tagFilter]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRefresh} />;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            icon="RefreshCw"
            className="text-slate-600 hover:text-slate-800"
          >
            Refresh
          </Button>
        </div>
        
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Search contacts..."
            className="w-full"
          />
          
          <div className="flex gap-3">
            <FilterDropdown
              options={companies}
              value={companyFilter}
              onChange={setCompanyFilter}
              placeholder="Filter by company"
            />
            <FilterDropdown
              options={tags}
              value={tagFilter}
              onChange={setTagFilter}
              placeholder="Filter by tag"
            />
          </div>
        </div>
        
        {(searchTerm || companyFilter || tagFilter) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <ApperIcon name="Filter" className="w-4 h-4" />
            <span>
              Showing {filteredContacts.length} of {contacts.length} contacts
            </span>
            {(searchTerm || companyFilter || tagFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setCompanyFilter("");
                  setTagFilter("");
                }}
                className="text-primary-600 hover:text-primary-700 p-1 h-auto"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          contacts.length === 0 ? (
            <Empty
              title="No contacts yet"
              description="Start building your network by adding your first contact."
              actionText="Add Contact"
              onAction={() => onEditContact(null)}
              icon="Users"
            />
          ) : (
            <Empty
              title="No matches found"
              description="Try adjusting your search terms or filters to find contacts."
              actionText="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setCompanyFilter("");
                setTagFilter("");
              }}
              icon="Search"
            />
          )
        ) : (
          <div className="p-6 space-y-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.Id}
                contact={contact}
                isSelected={selectedContact?.Id === contact.Id}
                onSelect={onSelectContact}
                onEdit={onEditContact}
                onDelete={() => handleDeleteContact(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;