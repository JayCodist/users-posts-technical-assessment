import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider, UseQueryResult } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import UsersTable from "../UsersTable";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../types";

// Mock the useUsers hook
vi.mock("../../hooks/useUsers");
const mockUseUsers = vi.mocked(useUsers);

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

const mockUsersData = {
  users: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      address: '{"street": "123 Main St", "state": "CA", "city": "Los Angeles", "zipcode": "90210"}',
      username: "johndoe",
      phone: "555-1234",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      address: '{"street": "456 Oak Ave", "state": "NY", "city": "New York", "zipcode": "10001"}',
      username: "janesmith",
      phone: "555-5678",
    },
  ],
  pagination: {
    pageNumber: 0,
    pageSize: 4,
    totalUsers: 2,
  },
};

describe("UsersTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseUsers.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const mockError = new Error("Failed to fetch users");
    mockUseUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      isError: true,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("renders users table with data", () => {
    mockUseUsers.mockReturnValue({
      data: mockUsersData.users,
      isLoading: false,
      error: null,
      isError: false,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    // Check table headers
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    // Check user data
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, CA, Los Angeles, 90210")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("456 Oak Ave, NY, New York, 10001")).toBeInTheDocument();
  });

  it("navigates to user posts when clicking on a user row", () => {
    mockUseUsers.mockReturnValue({
      data: mockUsersData.users,
      isLoading: false,
      error: null,
      isError: false,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    const userRow = screen.getByText("John Doe").closest("tr");
    expect(userRow).toBeInTheDocument();

    fireEvent.click(userRow!);

    expect(mockNavigate).toHaveBeenCalledWith("/users/1");
  });

  it("displays pagination information", () => {
    mockUseUsers.mockReturnValue({
      data: mockUsersData.users,
      isLoading: false,
      error: null,
      isError: false,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    expect(screen.getByText(/Showing 1 - 4 of 2 records/)).toBeInTheDocument();
  });

  it("handles pagination controls", () => {
    const mockUsersDataWithPagination = {
      ...mockUsersData,
      pagination: {
        ...mockUsersData.pagination,
        totalUsers: 10,
      },
    };

    mockUseUsers.mockReturnValue({
      data: mockUsersDataWithPagination.users,
      isLoading: false,
      error: null,
      isError: false,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    // Should show pagination information
    expect(screen.getByText(/Showing 1 - 4 of 10 records/)).toBeInTheDocument();

    // Should show page numbers
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders empty state when no users", () => {
    mockUseUsers.mockReturnValue({
      data: [] as User[],
      isLoading: false,
      error: null,
      isError: false,
    } as UseQueryResult<User[], Error>);

    render(
      <TestWrapper>
        <UsersTable />
      </TestWrapper>
    );

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });
});
