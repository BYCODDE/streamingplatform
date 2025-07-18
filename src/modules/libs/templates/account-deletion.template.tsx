import * as React from 'react';
import {
  Head,
  Html,
  Preview,
  Tailwind,
  Body,
  Section,
  Heading,
  Text,
  Link,
} from '@react-email/components';

interface AccountDeletionTemplateProps {
  domain: string;
}

export function AccountDeletionTemplate({
  domain,
}: AccountDeletionTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Account Deletion</Preview>
      <Tailwind>
        <Body>
          <Section className="text-center">
            <Heading className="text-3xl text-black font-bold">
              Your account has been deleted.
            </Heading>
            <Text className="text-base text-black mt-2">
              We are sorry to see you go. If you have any questions,please
              contact us at
              <Link href={`mailto:anaraliev217@gmail.com`}>
                anaraliev217@gmail.com
              </Link>
              .
            </Text>
          </Section>
          <Section className="bg-white text-black text-center rounded-lg shadow-md p-6 mb-4 ">
            <Text>
              You are receiving this email because you have been deleted.
            </Text>
            <Text>Thank you for using our service.</Text>
          </Section>
          <Section className="text-center">
            <Heading className="text-3xl text-black font-bold">
              If you would like to join us again here is link for you
            </Heading>
            <Link className="text-blue-500 underline uppercase" href={domain}>
              Register again from here
            </Link>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
