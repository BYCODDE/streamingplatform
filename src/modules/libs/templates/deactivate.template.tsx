import * as React from 'react';
import {
  Html,
  Preview,
  Tailwind,
  Body,
  Section,
  Heading,
  Text,
  Link,
} from '@react-email/components';
import { SessionMetadata } from 'src/shared/types/session-metadata.types';

interface DeactivateTemplateProps {
  token: string;
  metadata: SessionMetadata;
}

export function DeactivateTemplate({
  token,
  metadata,
}: DeactivateTemplateProps) {
  return (
    <Html>
      <Preview>Deactivate your account</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">
              Deactivate your account Request
            </Heading>
            <Text className="text-base text-black">
              You are receiving this email because you have requested to
              deactivate your account.
            </Text>
          </Section>
          <Section className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
            <Heading className="text-3xl text-black font-semibold">
              Code Confirmation
            </Heading>
            <Heading className="text-3xl text-black font-semibold">
              {token}
            </Heading>
            <Text className="text-base text-black mt-2">
              This code will be active for 5 minutes
            </Text>
          </Section>

          <Section className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
            <Heading className="text-xl font-semibold text-[#18b9ae]">
              Information about your account
            </Heading>
            <ul className="list-disc list-inside mt-2">
              <li>Location: {metadata.location.country}</li>
              <li>Operating System: {metadata.device.os}</li>
              <li>Browser: {metadata.device.browser}</li>
              <li>IP Address: {metadata.ip}</li>
            </ul>
            <Text className="mt-2 text-gray-600">
              If you did not request a account deactivation, please ignore this
              email.
            </Text>
          </Section>

          <Section className="text-center mt-8">
            <Text className="flex items-center justify-center gap-2">
              If you have any questions or need assistance, please contact us at
              <Link
                href="mailto:anaraliev217@gmail.com"
                className="text-[#18b9ae] underline"
              >
                anaraliev217@gmail.com
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
