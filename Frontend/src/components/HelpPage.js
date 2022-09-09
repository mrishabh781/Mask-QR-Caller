/* This example requires Tailwind CSS v2.0+ */
import { BoltIcon, ChatBubbleBottomCenterTextIcon, GlobeAltIcon, ScaleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx';
import React from 'react';
import { useMobileViewport } from '../helpers/mobileViewPort';

const features = [
  {
    name: 'Competitive rates',
    description:
      'We ensure that best will be delivered, that too in your budget.',
    icon: GlobeAltIcon,
  },
  {
    name: 'No hidden fees',
    description:
      'We are exception when dealing honestly and openly, we do not have any hidden charges.',
    icon: ScaleIcon,
  },
  {
    name: 'Responses are instant',
    description:
      'We usually take 1-2hr to resolve your request, if not then issue would be raised to higher authorities.',
    icon: BoltIcon,
  },
  {
    name: 'Mobile notifications',
    description:
      'For best, we make sure that you are updated with everything through mobile notifications.',
    icon: ChatBubbleBottomCenterTextIcon,
  }
]

export default function HelpPage() {
  const isMobile = useMobileViewport();
  return (
    <div className={`py-8 relative ${clsx({ 'top-10': isMobile, 'top-0': !isMobile })}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-semibold text-indigo-600">Need Help ??</h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            We are available 24/7 through our ChatBot, or you can also drop a mail #support@gupshup.io
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our help services are there at your single click. feel free to connect with us anytime. your concerns will be resolved at par.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6 text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
