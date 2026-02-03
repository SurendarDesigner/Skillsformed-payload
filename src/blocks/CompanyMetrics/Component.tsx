import React from 'react'
import type { CompanyMetricsBlock as CompanyMetricsBlockProps, Media } from '@/payload-types'
import styles from './styles.module.css'


type Props = {
  className?: string
} & CompanyMetricsBlockProps

export const CompanyMetricsBlock: React.FC<Props> = (props) => {
  const { headline, metrics } = props

  return (
    <div className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      
      {metrics && metrics.length > 0 && (
        <div className={styles.metricsContainer}>
          {metrics.map((metric, index) => {
             const icon = metric.icon as Media
             
             return (
               <div key={metric.id || index} className={styles.metricItem}>
                 <div className={styles.iconWrapper}>
                   {icon && icon.url && (
                     <img
                       src={icon.url}
                       alt={icon.alt || metric.label}
                       className={styles.icon}
                     />
                   )}
                 </div>
                 <h3 className={styles.value}>{metric.value}</h3>
                 <p className={styles.label}>{metric.label}</p>
               </div>
             )
          })}
        </div>
      )}
    </div>
  )
}
