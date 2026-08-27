import { FileInput, Stack, Text, Pill, Group } from '@mantine/core';
import { useState } from 'react';

interface SharedDocumentUploadProps {
  label?: string;
  description?: string;
}

export function DocumentUpload({
  label = "Upload Relevant Documents",
  description = "All Major file types supported"
}: SharedDocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Stack gap="xs">
      <FileInput
        label={label}
        description={description}
        placeholder="Click to browse or upload multiple files..."
        multiple
        value={files}
        onChange={setFiles}
        accept="image/png,image/jpeg,application/pdf,.doc,.docx"
        clearable
      />

      {/* Renders file badges so the user can review attached items */}
      {files.length > 0 && (
        <Group gap="xs" mt="xs">
          <Text size="xs" c="dimmed" fw={500}>Attached ({files.length}):</Text>
          {files.map((file, idx) => (
            <Pill key={idx} size="sm" withRemoveButton onRemove={() => setFiles(files.filter((_, i) => i !== idx))}>
              {file.name}
            </Pill>
          ))}
        </Group>
      )}
    </Stack>
  );
}