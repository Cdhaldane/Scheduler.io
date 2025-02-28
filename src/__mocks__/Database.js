// __mocks__/Database.js
export const supabase = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  then: jest.fn().mockResolvedValue({ data: {}, error: null }),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: jest.fn((callback) => {
      const subscription = {
        unsubscribe: jest.fn(),
      };
      callback("SIGNED_OUT", null);
      return { data: { subscription } };
    }),
  },
};

export const getOrganization = jest.fn().mockResolvedValue({
  id: "org1",
  name: "Organization 1",
});

export const addBooking = jest.fn().mockResolvedValue({ res: {}, error: null });
export const sendEmail = jest.fn().mockResolvedValue();

export const updateUser = jest.fn();
