"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Building2, Users, Briefcase, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface WelcomeScreenProps {
    onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    const [showContent, setShowContent] = useState(false)
    const we = useTranslations('onboarding')

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-25 via-orange-100 to-amber-25">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-3xl px-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: showContent ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                        <Building2 className="w-12 h-12 text-white" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
                >
                    {we('welcomeScreenTitle')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto"
                >
                    {we('welcomeScreenDescription')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg backdrop-blur-sm">
                        <Building2 className="w-8 h-8 text-orange-400 mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">{we('step1')}</h3>
                        <p className="text-sm text-gray-600 text-center">{we('step1Description')}</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg backdrop-blur-sm">
                        <Briefcase className="w-8 h-8 text-orange-400 mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">{we('step2')}</h3>
                        <p className="text-sm text-gray-600 text-center">{we('step2Description')}</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg backdrop-blur-sm">
                        <Users className="w-8 h-8 text-orange-400 mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">{we('step3')}</h3>
                        <p className="text-sm text-gray-600 text-center">{we('step3Description')}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="space-y-4"
                ></motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="space-y-4"
                >
                    <Button
                        onClick={onStart}
                        size="lg"
                        className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-300"
                    >
                        {we('startSetup')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}
