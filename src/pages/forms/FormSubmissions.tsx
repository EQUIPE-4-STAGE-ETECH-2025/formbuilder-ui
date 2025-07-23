import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { useToast } from '../../hooks/useToast';
import { Form, Submission } from '../../types';
import { formsAPI, submissionsAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function FormSubmissions() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      const [formResponse, submissionsResponse] = await Promise.all([
        formsAPI.getById(id!),
        submissionsAPI.getByFormId(id!)
      ]);

      if (formResponse.success && formResponse.data) {
        setForm(formResponse.data);
      }

      if (submissionsResponse.success && submissionsResponse.data) {
        setSubmissions(submissionsResponse.data);
      }
    } catch {
      console.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  const handleExport = async () => {
    if (!id) return;

    setExporting(true);
    try {
      const response = await submissionsAPI.exportCsv(id);
      if (response.success && response.data) {
        // Create and download CSV file
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `submissions-${form?.title || 'formulaire'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToast({
          type: 'success',
          title: 'Export réussi',
          message: 'Le fichier CSV a été téléchargé'
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Erreur d\'export',
        message: 'Impossible d\'exporter les données'
      });
    } finally {
      setExporting(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (!searchTerm) return true;
    
    const searchableData = Object.values(submission.data).join(' ').toLowerCase();
    return searchableData.includes(searchTerm.toLowerCase());
  });

  // Pagination calculations
  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Formulaire non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-600">{submissions.length} soumissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            loading={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              <p className="text-sm text-gray-600">Total des soumissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => {
                  const date = new Date(s.submittedAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-sm text-gray-600">Ce mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => {
                  const date = new Date(s.submittedAt);
                  const now = new Date();
                  return date.toDateString() === now.toDateString();
                }).length}
              </p>
              <p className="text-sm text-gray-600">Aujourd'hui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les soumissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Soumissions</h3>
        </CardHeader>
        <CardContent>
          {paginatedSubmissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm 
                  ? 'Aucune soumission ne correspond à votre recherche'
                  : 'Aucune soumission trouvée'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      {form.fields.map((field) => (
                        <th key={field.id} className="text-left py-3 px-4 font-medium text-gray-900">
                          {field.label}
                        </th>
                      ))}
                      <th className="text-left py-3 px-4 font-medium text-gray-900">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {formatDistanceToNow(new Date(submission.submittedAt), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </td>
                        {form.fields.map((field) => (
                          <td key={field.id} className="py-3 px-4 text-sm text-gray-900">
                            {submission.data[field.id] || '-'}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {submission.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}