import React from "react";
import { format } from "date-fns";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ContactDetail = ({ contact, onEdit, onClose }) => {
  if (!contact) {
    return (
<div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Select a Contact Card
          </h3>
          <p className="text-slate-600">
            Click on a contact card from the grid to view their detailed information
          </p>
        </div>
      </div>
    );
  }

  const tagColors = {
    "lead": "default",
    "client": "success",
    "prospect": "warning",
    "enterprise": "secondary",
    "priority": "destructive",
    "startup": "outline",
    "decision-maker": "default",
    "creative": "secondary",
    "retail": "outline",
    "healthcare": "success",
    "finance": "warning"
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
<div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Contact Details</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(contact)}
              icon="Edit2"
              size="sm"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              size="sm"
              className="lg:hidden"
              icon="X"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Avatar
            src={contact.photo}
            alt={`${contact.firstName} ${contact.lastName}`}
            size="xl"
            className="shrink-0"
          />
          
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-lg font-semibold text-slate-700 mb-1">
              {contact.position}
            </p>
            <p className="text-lg font-bold text-primary-600">
              {contact.company}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-8">
          {/* Contact Information */}
          <section>
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Contact" className="w-5 h-5 text-primary-600" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <ApperIcon name="Mail" className="w-4 h-4 text-slate-500" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
                    >
                      {contact.email}
</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50">
                      <ApperIcon name="Mail" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-500">Email Status</p>
                      <Badge 
                        variant={
                          contact.emailStatus === "Send" ? "success" : 
                          contact.emailStatus === "Not Send" ? "destructive" : 
                          "default"
                        }
                        className="mt-1"
                      >
                        {contact.emailStatus || "New"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <ApperIcon name="Phone" className="w-4 h-4 text-slate-500" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Company
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <ApperIcon name="Building" className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900 font-medium">
                      {contact.company}
                    </span>
                  </div>
                </div>
                
                {contact.position && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Position
                    </label>
                    <div className="mt-1 flex items-center gap-3">
                      <ApperIcon name="Briefcase" className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-900 font-medium">
                        {contact.position}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <section>
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Tag" className="w-5 h-5 text-primary-600" />
                Tags
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tagColors[tag] || "outline"}
                    className="text-sm font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {contact.notes && (
            <section>
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
                Notes
              </h4>
              
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section>
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-primary-600" />
              Timeline
            </h4>
            
            <div className="space-y-3">
<div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Plus" className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Contact Created
                  </span>
                </div>
                <span className="text-sm text-green-700 font-medium">
                  {format(new Date(contact.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
              
{contact.updatedAt !== contact.createdAt && (
                <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Edit" className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Last Updated
                    </span>
                  </div>
                  <span className="text-sm text-blue-700 font-medium">
                    {format(new Date(contact.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;