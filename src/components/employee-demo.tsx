'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployeeStore } from '@/stores';

export function EmployeeDemo() {
  // Use separate translation hooks for different namespaces
  const tEmployees = useTranslations('employees');
  const tCommon = useTranslations('common');
  const { employees, isLoading, loadEmployees, addEmployee } = useEmployeeStore();

  useEffect(() => {
    if (employees.length === 0) {
      loadEmployees();
    }
  }, [employees.length, loadEmployees]);

  const handleAddEmployee = () => {
    const newEmployee = {
      firstName: 'New',
      lastName: 'Employee',
      email: 'new.employee@company.com',
      position: 'Developer',
      department: 'Engineering',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 60000
    };
    addEmployee(newEmployee);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tEmployees('title')} Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {employees.length} {tEmployees('title').toLowerCase()}
            </p>
            <Button onClick={handleAddEmployee} size="sm">
              {tEmployees('addEmployee')}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">{tCommon('loading')}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {employees.map((employee) => (
                <div key={employee.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.position} • {employee.department}
                      </p>
                      <p className="text-xs text-gray-400">
                        {employee.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${employee.salary.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.hireDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
