export interface getEventByCompanyUuidResponse {
  data: Array<{
    uuid: string;
    name: string;
    start_date: string;
    end_date: string;
    photo: string | null;
  }>;
}

export interface CreateEventPayload {
  company_uuid: string;
  name: string;
  start_date: string;
  end_date: string;
  photo: string | null;
}
