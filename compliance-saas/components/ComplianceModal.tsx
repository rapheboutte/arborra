import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface ComplianceRequirement {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  documents?: Array<{
    id: string;
    title: string;
    fileUrl: string;
  }>;
}

interface ComplianceDocument {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

interface ComplianceFramework {
  framework: string;
  description?: string;
  complianceScore: number;
  requirements: ComplianceRequirement[];
  documents: ComplianceDocument[];
  enabled: boolean;
  lastUpdated: Date;
}

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  framework?: ComplianceFramework;
}

export function ComplianceModal({ isOpen, onClose, framework }: ComplianceModalProps) {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                  {framework?.framework || 'Compliance'} Overview
                </Dialog.Title>

                {framework ? (
                  <>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        {framework.description || `${framework.framework} compliance framework overview`}
                      </p>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Compliance Score</span>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                            framework.complianceScore >= 80 ? "bg-green-100 text-green-800" :
                            framework.complianceScore >= 50 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {framework.complianceScore}%
                          </span>
                        </div>
                      </div>

                      {framework.requirements.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900">Requirements</h4>
                          <ul className="mt-2 divide-y divide-gray-100">
                            {framework.requirements.map((req) => (
                              <li key={req.id} className="py-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{req.title}</p>
                                    {req.description && (
                                      <p className="mt-1 text-sm text-gray-500">{req.description}</p>
                                    )}
                                  </div>
                                  <span className={cn(
                                    "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                                    req.status === 'COMPLETED' ? "bg-green-100 text-green-800" :
                                    req.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-800" :
                                    "bg-gray-100 text-gray-800"
                                  )}>
                                    {req.status}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {framework.documents.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900">Documents</h4>
                          <ul className="mt-2 divide-y divide-gray-100">
                            {framework.documents.map((doc) => (
                              <li key={doc.id} className="py-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                                    {doc.description && (
                                      <p className="mt-1 text-sm text-gray-500">{doc.description}</p>
                                    )}
                                  </div>
                                  <a
                                    href={doc.fileUrl}
                                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      No compliance data available.
                    </p>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
