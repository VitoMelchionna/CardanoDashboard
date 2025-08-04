import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from '@chakra-ui/react';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';

interface TweetResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
  timestamp?: string;
}

export default function PostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<TweetResponse | null>(null);
  const toast = useToast();

  const triggerDailyTweet = async () => {
    setIsLoading(true);
    setLastResponse(null);

    try {
      const response = await fetch('/api/test/daily-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: TweetResponse = await response.json();

      setLastResponse(data);

      if (response.ok && data.success) {
        toast({
          title: 'Tweet Posted Successfully!',
          description: data.message || 'Daily Cardano metrics tweet has been posted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to Post Tweet',
          description: data.error || 'An error occurred while posting the tweet.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastResponse({ error: 'Network Error', details: errorMessage });
      toast({
        title: 'Network Error',
        description: 'Failed to connect to the server. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = () => {
    window.open('/api/status', '_blank');
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Cardano Dashboard - Tweet Manager
          </Heading>
          <Text color="gray.600">
            Manually trigger the daily Cardano metrics tweet
          </Text>
        </Box>

        <Card>
          <CardHeader>
            <Heading size="md">Daily Tweet Trigger</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Text>
                Click the button below to manually trigger the daily Cardano metrics tweet.
                This will fetch fresh data and post it to Twitter.
              </Text>
              
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={triggerDailyTweet}
                  isLoading={isLoading}
                  loadingText="Posting Tweet..."
                  leftIcon={isLoading ? <Spinner size="sm" /> : <RepeatIcon />}
                  disabled={isLoading}
                >
                  {isLoading ? 'Posting Tweet...' : 'Trigger Daily Tweet'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={checkStatus}
                  leftIcon={<ExternalLinkIcon />}
                >
                  Check Status
                </Button>
              </HStack>

              <Text fontSize="sm" color="gray.500">
                The daily tweet is automatically scheduled for 16:30 CET via Vercel Cron Jobs.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {lastResponse && (
          <Card>
            <CardHeader>
              <Heading size="md">Last Response</Heading>
            </CardHeader>
            <CardBody>
              <Alert
                status={lastResponse.success ? 'success' : 'error'}
                variant="subtle"
                flexDirection="column"
                alignItems="flex-start"
                p={4}
              >
                <AlertIcon />
                <AlertTitle>
                  {lastResponse.success ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription mt={2}>
                  {lastResponse.message || lastResponse.error}
                  {lastResponse.details && (
                    <Text mt={2} fontSize="sm">
                      Details: {lastResponse.details}
                    </Text>
                  )}
                  {lastResponse.timestamp && (
                    <Text mt={2} fontSize="sm">
                      Timestamp: {new Date(lastResponse.timestamp).toLocaleString()}
                    </Text>
                  )}
                </AlertDescription>
              </Alert>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <Heading size="md">Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={1}>
                  What happens when you trigger the tweet:
                </Text>
                <VStack spacing={1} align="stretch" pl={4}>
                  <Text fontSize="sm">• Invalidates the current cache</Text>
                  <Text fontSize="sm">• Fetches fresh Cardano metrics from Blockfrost</Text>
                  <Text fontSize="sm">• Formats the data into a tweet</Text>
                  <Text fontSize="sm">• Posts the tweet to Twitter</Text>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={1}>
                  Automatic Schedule:
                </Text>
                <Text fontSize="sm">
                  Daily tweets are automatically posted at 16:30 CET (15:30 UTC) via Vercel Cron Jobs.
                </Text>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={1}>
                  API Endpoints:
                </Text>
                <VStack spacing={1} align="stretch" pl={4}>
                  <Text fontSize="sm">• <code>/api/test/daily-tweet</code> - Manual trigger</Text>
                  <Text fontSize="sm">• <code>/api/cron/daily-tweet</code> - Cron job endpoint</Text>
                  <Text fontSize="sm">• <code>/api/status</code> - System status</Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 