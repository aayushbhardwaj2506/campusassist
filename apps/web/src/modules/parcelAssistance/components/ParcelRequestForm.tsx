import { useState, type FormEvent } from 'react';

import { Button, FormErrorMessage, TextAreaField, TextField } from '@core/components';
import type { ParcelAssistanceMetadata } from '../types';

interface ParcelRequestFormProps {
  /** Pre-fills the form for editing; omitted for a fresh create. */
  initialValues?: ParcelAssistanceMetadata;
  submitLabel: string;
  onSubmit: (values: ParcelAssistanceMetadata) => Promise<void>;
}

export function ParcelRequestForm({ initialValues, submitLabel, onSubmit }: ParcelRequestFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [pickupLocation, setPickupLocation] = useState(initialValues?.pickupLocation ?? '');
  const [courier, setCourier] = useState(initialValues?.courier ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim() || !pickupLocation.trim()) {
      setFormError('Please fill in the title, description, and pickup location.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        pickupLocation: pickupLocation.trim(),
        courier: courier.trim() || undefined,
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormErrorMessage message={formError} />

      <TextField
        label="Title"
        placeholder="e.g. Pick up my Amazon parcel"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <TextAreaField
        label="Description"
        placeholder="Any details the helper should know — size, timing, etc."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <TextField
        label="Pickup location"
        placeholder="e.g. Block C front desk"
        value={pickupLocation}
        onChange={(event) => setPickupLocation(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <TextField
        label="Courier (optional)"
        placeholder="e.g. Amazon, FedEx"
        value={courier}
        onChange={(event) => setCourier(event.target.value)}
        disabled={isSubmitting}
      />

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
