import React from 'react'
import { NextSeo } from 'next-seo'
import NextError from 'next/error'

export class ErrorPage extends NextError {
  render() {
    return (
      <div>
        <NextSeo noindex nofollow title="Server error" description="" />

        <h2>Server error</h2>
      </div>
    )
  }
}
