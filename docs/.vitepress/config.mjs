import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default {
    title: 'Areal-hr_ext-test',
    description: 'Документация для проекта по управлению сотрудниками',
    lastUpdated: true,
    themeConfig: {
        nav: [
            { text: 'Главная', link: '/' },
            { text: 'Руководство', link: '/guide/' },
            { text: 'Функции', link: '/features/' },
            { text: 'API', link: '/api/' },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: 'Руководство',
                    items: [
                        { text: 'Введение', link: '/guide/' },
                        { text: 'Быстрый старт', link: '/guide/getting-started' },
                        { text: 'Архитектура', link: '/guide/architecture' },
                    ]
                }
            ],
            '/features/': [
                {
                    text: 'Функциональность',
                    items: [
                        { text: 'Обзор функций', link: '/features/' },
                        { text: 'Управление сотрудниками', link: '/features/employees' },
                        { text: 'Работа с файлами', link: '/features/files' },
                        { text: 'Управление отделами', link: '/features/departments' },
                        { text: 'Управление организациями', link: '/features/organizations' },
                        { text: 'Управление должностями', link: '/features/positions' },
                        { text: 'Управление пользователями', link: '/features/users' },
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API',
                    items: [
                        { text: 'Обзор API', link: '/api/' },
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/Sa1Ko-inv/areal-hr_ext-test' }
        ],
        footer: {
            message: 'Документация разработана с использованием VitePress',
            copyright: 'Copyright © 2023-настоящее время Areal Inc.'
        },
        search: {
            provider: 'local'
        }
    }
}
