import { useState, useEffect, useCallback } from "react";
import { contactsApi } from "@/services/apiClient";
import { ContactPerson } from "@kompass/shared";

export function useContacts(customerId?: string) {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const result = await contactsApi.list({ customerId });
      if (result && Array.isArray(result.data)) {
        setContacts(result.data as unknown as ContactPerson[]);
      } else if (Array.isArray(result)) {
        setContacts(result as unknown as ContactPerson[]);
      } else {
        setContacts([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching contacts", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (
    contact: Omit<
      ContactPerson,
      | "_id"
      | "_rev"
      | "type"
      | "customerId"
      | "createdAt"
      | "modifiedAt"
      | "version"
      | "createdBy"
      | "modifiedBy"
    >,
  ) => {
    if (!customerId) return;
    try {
      const newContactData = {
        ...contact,
        customerId,
        // Server should handle ID, metadata, defaults
      };
      const result = await contactsApi.create(newContactData);
      await fetchContacts(); // Refresh
      return result as ContactPerson;
    } catch (err) {
      console.error("Error adding contact", err);
      throw err;
    }
  };

  return { contacts, loading, error, addContact, refresh: fetchContacts };
}

export function useContact(id?: string) {
  const [contact, setContact] = useState<ContactPerson | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchContact = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await contactsApi.get(id);
      setContact(result as unknown as ContactPerson);
      setError(null);
    } catch (err) {
      console.error("Error fetching contact", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const saveContact = async (data: Partial<ContactPerson>) => {
    setLoading(true);
    try {
      let result;
      if (id && contact) {
        result = await contactsApi.update(id, data);
      } else {
        result = await contactsApi.create(data);
      }
      setContact(result as unknown as ContactPerson);
      return result;
    } catch (err) {
      console.error("Error saving contact", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { contact, loading, error, saveContact, refetch: fetchContact };
}
