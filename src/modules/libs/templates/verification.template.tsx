import * as React from 'react';
import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface VerificationTemplateProps {
  domain: string;
  token: string;
}

export function VerificationTemplate({
  domain,
  token,
}: VerificationTemplateProps) {
  const verificationLink = `${domain}/account/verify?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">
              Checking your email
            </Heading>
            <Text className="text-base text-black">
              Thanks for joining! We're excited to have you as part of our
              streaming community. To get started and ensure the security of
              your account, please verify your email address by clicking the
              link below. This helps us keep your account safe and lets you
              access all our features.
            </Text>
            <Link
              href={verificationLink}
              className="inline-flex justify-center item-center  rounded-md text-sm font-medium text-black bg-[#18b9ae] px-5 py-2 "
            >
              Confirm your email
            </Link>
          </Section>

          <Section className="text-center mt-8">
            <Text className="flex items-center justify-center gap-2">
              If you have any questions or need assist,please contact us at
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
