import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/store/useAuth';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const { token } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not fetch customers');
      setCustomers(data.customers);
      setFilteredCustomers(data.customers);
    } catch (error) {
      toast.error(error.message || 'Server Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCustomers].sort((a, b) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return direction === 'asc'
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      if (typeof a[key] === 'string') {
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    });
    setFilteredCustomers(sorted);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Directory</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name, email, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button
          onClick={fetchCustomers}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Refresh
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>No customers found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <Table className="w-full">
            <TableCaption className="text-gray-600">List of registered customers</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left text-gray-700 font-semibold py-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-left text-gray-700 font-semibold py-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1"
                  >
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-left text-gray-700 font-semibold py-3 hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('address')}
                    className="flex items-center gap-1"
                  >
                    Address
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                
                <TableHead className="text-left text-gray-700 font-semibold py-3 hidden lg:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('visits')}
                    className="flex items-center gap-1"
                  >
                    Visits
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-left text-gray-700 font-semibold py-3 hidden lg:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('loyaltyPoints')}
                    className="flex items-center gap-1"
                  >
                    Loyalty Points
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer._id} className="hover:bg-gray-100 transition-colors">
                  <TableCell className="py-3">{customer.name}</TableCell>
                  <TableCell className="py-3">{customer.email}</TableCell>
                  <TableCell className="py-3 hidden sm:table-cell">{customer.address || 'N/A'}</TableCell>
                  <TableCell className="py-3 hidden lg:table-cell">{customer.visits}</TableCell>
                  <TableCell className="py-3 hidden lg:table-cell">{customer.loyaltyPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Customers;