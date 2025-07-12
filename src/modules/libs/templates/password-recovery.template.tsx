import { SessionMetadata } from 'src/shared/types/session-metadata.types';

import {
  Body,
  Link,
  Section,
  Text,
  Tailwind,
  Preview,
  Heading,
} from '@react-email/components';
import { Html } from '@react-email/html';

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
  metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
  domain,
  token,
  metadata,
}: PasswordRecoveryTemplateProps) {
  const resetLink = `${domain}/account/reset-password?token=${token}`;

  return (
    <Html>
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">
              Reset your password
            </Heading>
            <Text className="text-base text-black">
              We received a request to reset your password. If you did not make
              this request, please ignore this email. If you did make this
              request, please click the button below to reset your password.
            </Text>
            <Link
              href={resetLink}
              className="inline-flex justify-center item-center  rounded-md text-sm font-medium text-black bg-[#18b9ae] px-5 py-2 "
            >
              Reset your password
            </Link>
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
              If you did not request a password reset, please ignore this email.
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
