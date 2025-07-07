import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// User interface
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  login: (email: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
}

// Auth store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,

        login: async (email: string) => {
          set({ isLoading: true });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user data
            const mockUser: User = {
              id: '1',
              email,
              firstName: 'John',
              lastName: 'Doe',
              role: 'admin'
            };
            
            set({
              user: mockUser,
              isAuthenticated: true,
              token: 'mock-token',
              isLoading: false
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            isLoading: false
          });
        },

        setUser: (user: User) => {
          set({ user, isAuthenticated: true });
        },

        setToken: (token: string) => {
          set({ token });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        }
      }),
      {
        name: 'auth-store',
        // Only persist certain fields
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token
        })
      }
    ),
    {
      name: 'auth-store'
    }
  )
);

// Employee interface
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
}

// Employee state interface
interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  searchTerm: string;
  
  // Actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  setSelectedEmployee: (employee: Employee | null) => void;
  setSearchTerm: (term: string) => void;
  loadEmployees: () => Promise<void>;
}

// Employee store
export const useEmployeeStore = create<EmployeeState>()(
  devtools(
    (set) => ({
      employees: [],
      selectedEmployee: null,
      isLoading: false,
      searchTerm: '',

      addEmployee: (employee) => {
        const newEmployee: Employee = {
          ...employee,
          id: Date.now().toString()
        };
        set(state => ({
          employees: [...state.employees, newEmployee]
        }));
      },

      updateEmployee: (id, updatedEmployee) => {
        set(state => ({
          employees: state.employees.map(emp => 
            emp.id === id ? { ...emp, ...updatedEmployee } : emp
          )
        }));
      },

      deleteEmployee: (id) => {
        set(state => ({
          employees: state.employees.filter(emp => emp.id !== id),
          selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee
        }));
      },

      setSelectedEmployee: (employee) => {
        set({ selectedEmployee: employee });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
      },

      loadEmployees: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock employees data
          const mockEmployees: Employee[] = [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@company.com',
              position: 'Software Engineer',
              department: 'Engineering',
              hireDate: '2023-01-15',
              salary: 75000
            },
            {
              id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@company.com',
              position: 'Product Manager',
              department: 'Product',
              hireDate: '2023-02-20',
              salary: 85000
            },
            {
              id: '3',
              firstName: 'Mike',
              lastName: 'Johnson',
              email: 'mike.johnson@company.com',
              position: 'Designer',
              department: 'Design',
              hireDate: '2023-03-10',
              salary: 70000
            }
          ];
          
          set({ employees: mockEmployees, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'employee-store'
    }
  )
);
