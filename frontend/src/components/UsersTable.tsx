import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUsers, useUsersCount } from "../hooks/useUsers";
import { User } from "../types";
import ErrorMessage from "./ui/ErrorMessage";
import Table, { Column } from "./table/Table";

const UsersTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 4;
  const navigate = useNavigate();

  // Get current page from URL search params, default to 1 (1-based indexing for URL)
  const currentPageFromUrl = useMemo(() => {
    const page = searchParams.get('page');
    return page ? Math.max(1, parseInt(page, 10)) : 1;
  }, [searchParams]);

  // Convert to 0-based indexing for API calls
  const currentPage = currentPageFromUrl - 1;

  const { data: users, isLoading, error, isError } = useUsers(currentPage, pageSize);
  const { data: totalUsers } = useUsersCount();

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const formatAddress = (address: string): string => {
    try {
      const addr = JSON.parse(address);
      return `${addr.street}, ${addr.state}, ${addr.city}, ${addr.zipcode}`;
    } catch {
      return address;
    }
  };

  const columns: Column<User>[] = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '392px',
      render: (address: unknown) => (
        <div className="truncate w-96" title={formatAddress(address as string)}>
          {formatAddress(address as string)}
        </div>
      ),
    },
  ];

  const handleRowClick = (row: User) => {
    handleUserClick(row.id);
  };

  const handlePageChange = (pageNumber: number) => {
    // Update URL search params with new page number (1-based indexing for URL)
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (pageNumber === 1) {
        // Remove page param for page 1 to keep URL clean
        newParams.delete('page');
      } else {
        newParams.set('page', pageNumber.toString());
      }
      return newParams;
    });
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          </div>
          <div className="p-6">
            <ErrorMessage 
              message={error?.message || 'Failed to load users'} 
              onRetry={() => window.location.reload()} 
            />
          </div>
        </div>
      </div>
    );
  }

  const tablePagination = {
    pageSize,
    total: totalUsers?.count || 0,
    pageNumber: currentPageFromUrl, // Already 1-based from URL
  };

  return (
    <div className="lg:px-32 lg:py-20 py-6 px-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users</h1>
      
        <Table<User>
          dataSource={users || []}
          columns={columns}
          pagination={tablePagination}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          emptyText="No users found."
          loading={isLoading}
        />
    </div>
  );
};

export default UsersTable;